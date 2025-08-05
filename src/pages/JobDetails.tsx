import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, IndianRupee, Clock, Building, ArrowLeft, Send } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, applyToJob, getApplicationsByApplicant } = useJobs();
  const { user } = useAuth();
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  const job = jobs.find(j => j.id === id);
  const userApplications = user ? getApplicationsByApplicant(user.id) : [];
  const hasApplied = userApplications.some(app => app.jobId === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !coverLetter.trim()) return;

    setApplying(true);
    
    try {
      applyToJob(job.id, {
        jobId: job.id,
        applicantId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        coverLetter: coverLetter.trim(),
        status: 'pending'
      });
      
      setShowApplicationForm(false);
      setCoverLetter('');
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const canApply = user && user.role === 'jobseeker' && !hasApplied && job.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  job.type === 'full-time' ? 'bg-green-100 text-green-800' :
                  job.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                  job.type === 'contract' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-gray-500" />
                <span className="text-xl text-gray-700">{job.company}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Posted {job.postedDate}</span>
                </div>
              </div>
            </div>

            <div className="ml-8">
              {canApply ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Apply Now</span>
                </button>
              ) : hasApplied ? (
                <div className="bg-green-100 text-green-800 px-8 py-3 rounded-lg flex items-center space-x-2">
                  <span>✓ Applied</span>
                </div>
              ) : !user ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Login to apply</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </button>
                </div>
              ) : user.role === 'employer' ? (
                <div className="bg-gray-100 text-gray-600 px-8 py-3 rounded-lg">
                  Employer Account
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-600 px-8 py-3 rounded-lg">
                  Not Available
                </div>
              )}
            </div>
          </div>

          {/* Deadline Warning */}
          <div className="flex items-center text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 mr-2" />
            <span>Application deadline: {job.deadline}</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="text-sm text-gray-900">{job.company}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="text-sm text-gray-900">{job.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                  <dd className="text-sm text-gray-900">
                    {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Salary</dt>
                  <dd className="text-sm text-gray-900">{job.salary}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Posted Date</dt>
                  <dd className="text-sm text-gray-900">{job.postedDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                  <dd className="text-sm text-gray-900">{job.deadline}</dd>
                </div>
              </dl>
            </div>

            {canApply && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Apply?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Submit your application and cover letter to be considered for this position.
                </p>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for {job.title}</h2>
              
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={6}
                    placeholder="Tell us why you're interested in this position and how your skills make you a great fit..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={applying || !coverLetter.trim()}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}