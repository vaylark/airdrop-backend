const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const { walletAddress } = req.body;

        // Extrae la dirección de wallet del token
        const tokenWalletAddress = req.decodedToken.walletAddress;

        // Validar que se proporcionó una walletAddress en el body
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required.' });
        };

        // Validar que la wallet del token coincida con la del body
        if (walletAddress !== tokenWalletAddress) {
            return res.status(403).json({ message: 'The connected wallet does not match the one provided to the bot.' });
        }

        // Buscar el usuario en la base de datos por walletAddress
        const user = await User.findOne({ walletAddress });

        if (!user) {
            return res.status(404).json({ message: 'The bot has no record of the connected wallet, make sure to send a wallet to the bot first.' });
        }

        // Validar que el usuario no haya recibido un airdrop previamente
        if (user.received) {
            return res.status(403).json({ message: 'You have already claimed the airdrop.' });
        }

        // Todo está validado, pasa la información al siguiente middleware
        req.walletAddress = walletAddress;
        req.user = user; // Opcional: puedes pasar el usuario al siguiente middleware si es necesario
        next();
    } catch (error) {
        console.error('Middleware validation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
