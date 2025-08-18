const express = require('express');
const router = express.Router();
const { extractSkills, normalizeLocation, areLocationsNear, matchCandidates } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');

router.post('/extract-skills', protect, extractSkills);
router.post('/normalize-location', protect, normalizeLocation);
router.post('/near', protect, areLocationsNear);
router.post('/match-candidates', protect, checkRole('recruiter'), matchCandidates);

module.exports = router;


