const express = require('express');
const router = express.Router();
const { logPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logPayment);

module.exports = router;



