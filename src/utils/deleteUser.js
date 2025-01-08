
const User = require('../models/User');

const deleteUser = async (walletAddress) => {
    try {
        const user = await User.findOne({ walletAddress, received: false });

        if(user) {
            await User.deleteOne({ walletAddress });
        } else {
            console.warn("No user found with the provided wallet address or the user has already received the airdrop.");
        }

        return user;
    } catch (error) {
        console.error("Error deleting user:", error.message);
        return null;
    }
}

module.exports = deleteUser;