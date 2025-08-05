const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  type: String,
  deadline: Date,
  requirements: String,
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  filled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Job', jobSchema);
