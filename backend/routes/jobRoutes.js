const express = require('express');
const router = express.Router();
const { createJob, applyJob, getJobs } = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', auth, createJob);
router.post('/apply/:id', auth, applyJob);

module.exports = router;
