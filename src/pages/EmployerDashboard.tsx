import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobContext';
import { Plus, Briefcase, Users, Eye, Edit2, Trash2, X } from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { jobs, applications, addJob, updateJob, deleteJob, getJobsByEmployer, getApplicationsByJob, updateApplicationStatus } = useJobs();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications'>('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'remote',
    salary: '',
    description: '',
    requirements: '',
    deadline: ''
  });

  const employerJobs = user ? getJobsByEmployer(user.id) : [];
  const allApplications = employerJobs.flatMap(job => 
    getApplicationsByJob(job.id).map(app => ({ ...app, jobTitle: job.title }))
  );

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const jobData = {
      ...jobForm,
      company: user.name,
      postedBy: user.id,
      requirements: jobForm.requirements.split(',').map(req => req.trim()),
      status: 'active' as const
    };

    if (editingJob) {
      updateJob(editingJob, jobData);
      setEditingJob(null);
    } else {
      addJob(jobData);
    }

    setJobForm({
      title: '',
      location: '',
      type: 'full-time',
      salary: '',
      description: '',
      requirements: '',
      deadline: ''
    });
    setShowJobForm(false);
  };

  const handleEditJob = (job: any) => {
    setJobForm({
      title: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join(', '),
      deadline: job.deadline
    });
    setEditingJob(job.id);
    setShowJobForm(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your job postings and applications</p>
          </div>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{employerJobs.length}</p>
                <p className="text-gray-600 text-sm">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{allApplications.length}</p>
                <p className="text-gray-600 text-sm">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {allApplications.filter(app => app.status === 'pending').length}
                </p>
                <p className="text-gray-600 text-sm">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {allApplications.filter(app => app.status === 'accepted').length}
                </p>
                <p className="text-gray-600 text-sm">Hired</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Jobs ({employerJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications ({allApplications.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
              {allApplications.slice(0, 5).map((application) => (
                <div key={application.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{application.applicantName}</p>
                    <p className="text-sm text-gray-600">{application.jobTitle}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Jobs</h3>
              {employerJobs.slice(0, 5).map((job) => {
                const jobApplications = getApplicationsByJob(job.id);
                return (
                  <div key={job.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {jobApplications.length} applications
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="grid grid-cols-1 gap-6">
              {employerJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{job.location} • {job.type}</p>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Posted: {job.postedDate}</span>
                        <span>Applications: {getApplicationsByJob(job.id).length}</span>
                        <span>Deadline: {job.deadline}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            {allApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{application.applicantName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{application.jobTitle}</p>
                    <p className="text-gray-700 mb-4">{application.coverLetter}</p>
                    <p className="text-sm text-gray-500">Applied: {application.appliedDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingJob ? 'Edit Job' : 'Post New Job'}
                </h2>
                <button
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                    setJobForm({
                      title: '',
                      location: '',
                      type: 'full-time',
                      salary: '',
                      description: '',
                      requirements: '',
                      deadline: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      placeholder="e.g., $50,000 - $70,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={3}
                    placeholder="e.g., React, TypeScript, 3+ years experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingJob ? 'Update Job' : 'Post Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobForm(false);
                      setEditingJob(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
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