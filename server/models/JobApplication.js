const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
	{
		job: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
		applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		status: { type: String, enum: ['applied', 'viewed', 'in-progress', 'rejected'], default: 'applied' },
		applicationDate: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);



