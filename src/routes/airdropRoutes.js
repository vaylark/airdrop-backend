const express = require('express');
const validateToken = require('../middlewares/validateToken');
const airdropController = require('../controllers/airdropController.js');
const validateWallet = require('../middlewares/validateWallet');

const router = express.Router();

router.post('/validate', validateToken, airdropController.validated);

// Route to claim airdrop
router.post('/claim', [validateToken, validateWallet], airdropController.claimAirdrop);

router.put('/success', airdropController.success);

module.exports = router;
