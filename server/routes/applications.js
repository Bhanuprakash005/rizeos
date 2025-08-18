const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');
const { createApplication, getMyApplications, getApplicationsForJob } = require('../controllers/applicationController');

// Seeker creates application
router.post('/', protect, checkRole('seeker'), createApplication);
// Seeker views their applications
router.get('/mine', protect, checkRole('seeker'), getMyApplications);
// Recruiter views applications for a job they own
router.get('/job/:jobId', protect, checkRole('recruiter'), getApplicationsForJob);

module.exports = router;



