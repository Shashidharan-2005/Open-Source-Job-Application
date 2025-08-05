const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
  const job = new Job({ ...req.body, employer: req.user.id });
  await job.save();
  res.status(201).json(job);
};

exports.getJobs = async (req, res) => {
  const jobs = await Job.find().populate('employer', 'name email');
  res.json(jobs);
};

exports.applyJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ msg: 'Job not found' });

  job.applicants.push(req.user.id);
  await job.save();

  const user = await User.findById(req.user.id);
  user.appliedJobs.push(job._id);
  await user.save();

  res.json({ msg: 'Applied successfully' });
};
