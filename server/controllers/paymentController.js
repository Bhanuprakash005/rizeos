const Payment = require('../models/Payment');

// POST /api/payments
async function logPayment(req, res) {
	try {
		const { amountSol, toAddress, transactionSignature, mode } = req.body;
		if (!amountSol || !toAddress || !transactionSignature) {
			return res.status(400).json({ message: 'Missing fields' });
		}
		const payment = await Payment.create({
			user: req.user.id,
			amountSol,
			toAddress,
			transactionSignature,
			mode: mode || 'real'
		});
		return res.status(201).json(payment);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

module.exports = { logPayment };


