require('dotenv').config();
const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');

const QUICKNODE_RPC_URL = "https://delicate-greatest-brook.solana-mainnet.quiknode.pro/53910549b68afb02ca792acc6bb87cd7910f4b02";
const connection = new Connection(QUICKNODE_RPC_URL, "confirmed");

// Direcciones necesarias
const WALLET_ADDRESS = new PublicKey(process.env.TOKEN_ACCOUNT_ADDRESS); // Tu wallet
const MINT_ADDRESS = new PublicKey("59qU6WoJmoC849XpGA5iVpC8v3aL8GXjftnKDHbGTT35"); // Mint de $SHAFFY

console.log("TOKEN_ACCOUNT_ADDRESS:", process.env.TOKEN_ACCOUNT_ADDRESS);

// Función para validar la cuenta
const validateAccount = async () => {
    try {
        console.log("Verificando la cuenta de origen...");
        const accountInfo = await connection.getAccountInfo(WALLET_ADDRESS);

        if (!accountInfo) {
            console.error("La cuenta de origen no existe en la red.");
            return;
        }

        console.log("Información de la cuenta de origen:", accountInfo);

        // Verificar si el propietario de la cuenta es el programa SPL Token
        if (accountInfo.owner.toBase58() !== "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
            console.error("La cuenta de origen no es del tipo SPL Token.");
            return;
        }

        // Intentar obtener el balance para confirmar que es una cuenta SPL válida
        const tokenBalance = await connection.getTokenAccountBalance(WALLET_ADDRESS);
        console.log(`Balance de la cuenta de origen ($SHAFFY): ${tokenBalance.value.uiAmount}`);
    } catch (error) {
        console.error("Error al validar la cuenta de origen:", error);
    }
};

validateAccount();