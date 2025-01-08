const {
    Connection,
    Keypair,
    Transaction,
    PublicKey,
} = require('@solana/web3.js');
const {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const User = require('../models/User');


const QUICKNODE_RPC_URL = process.env.NODE_URL;
const connection = new Connection(QUICKNODE_RPC_URL, "confirmed");

// Token account keypair
const TOKEN_ACCOUNT = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SECRET_KEY)));

// Token mint address
const MINT_ADDRESS = new PublicKey(process.env.MINT_ADDRESS);

// Associanted account where the token are stored
const TOKEN_ACCOUNT_ADDRESS = new PublicKey(process.env.TOKEN_ACCOUNT_ADDRESS);


const claimAirdrop = async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required", success: false });
    }

    try {
        const userWallet = new PublicKey(walletAddress);

        const userAssociatedTokenAddress = await getAssociatedTokenAddress(
            MINT_ADDRESS,
            userWallet,
            false,
            TOKEN_PROGRAM_ID
        );

        const accountInfo = await connection.getAccountInfo(userAssociatedTokenAddress);

        const transaction = new Transaction();

        if (!accountInfo) {

            transaction.add(
                createAssociatedTokenAccountInstruction(
                    userWallet, 
                    userAssociatedTokenAddress,
                    userWallet,
                    MINT_ADDRESS
                )
            );
        }

        // Add transfer instruction
        transaction.add(
            createTransferInstruction(
                TOKEN_ACCOUNT_ADDRESS,
                userAssociatedTokenAddress,
                TOKEN_ACCOUNT.publicKey, 
                10_000 * Math.pow(10, 9), 
                [],
                TOKEN_PROGRAM_ID
            )
        );

        // Get the latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight =  lastValidBlockHeight + 300;
        transaction.feePayer = userWallet; 

        // Sign partial transaction
        transaction.partialSign(TOKEN_ACCOUNT);

        // Serialize the transaction
        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false, // Allow the client to sign
        });

        return res.status(200).json({
            transaction: serializedTransaction.toString("base64"),
            success: true,
        });

    } catch (error) {
        console.error("Error durante el proceso de airdrop:", error);
        return res.status(500).json({
            error: "Failed to create airdrop transaction.",
            success: false,
        });
    }
};


const success = async(req, res) => {
    const { walletAddress } = req.body;

    try {   
        const user = await User.findOneAndUpdate({ walletAddress }, { received: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        return res.status(200).json({ message: 'User updated', success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: 'Failed to update user', success: false });
    }
};


const validated = async (req, res) => {
    const { decodedToken } = req;

    if (!decodedToken) {
        return res.status(401).json({ message: 'The link has expired.', success: false });
    }

    const { walletAddress } = decodedToken;

    const user = await User.findOne({ walletAddress, received: true });

    if (user) {
        return res.status(410).json({ message: 'You have already received the airdrop.', success: false });
    }


    return res.status(200).json({ message: 'The link is valid.', success: true });
};



module.exports = {
    claimAirdrop,
    validated,
    success
};
