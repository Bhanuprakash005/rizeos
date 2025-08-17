const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		amountSol: { type: Number, required: true },
		toAddress: { type: String, required: true },
		transactionSignature: { type: String, required: true },
		mode: { type: String, enum: ['real', 'mock'], default: 'real' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);


