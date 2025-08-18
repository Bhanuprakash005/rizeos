const express = require('express');
const router = express.Router();
const { logPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');

router.use(protect, checkRole('recruiter'));
router.post('/', logPayment);

module.exports = router;


