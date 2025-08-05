import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'filled';
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

interface JobContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  getJobsByEmployer: (employerId: string) => Job[];
  getApplicationsByJob: (jobId: string) => Application[];
  getApplicationsByApplicant: (applicantId: string) => Application[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem('jobs');
    const savedApplications = localStorage.getItem('applications');
    
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      // Initialize with sample jobs
      const sampleJobs: Job[] = [
        {
          id: '1',
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          type: 'full-time',
          salary: '₹100,000 - ₹150,000',
          description: 'We are looking for a senior React developer to join our team...',
          requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
          postedBy: 'emp1',
          postedDate: '2024-01-15',
          deadline: '2024-02-15',
          status: 'active'
        },
        {
          id: '2',
          title: 'UX/UI Designer',
          company: 'DesignStudio',
          location: 'New York, NY',
          type: 'contract',
          salary: '₹75,000 - ₹90,000',
          description: 'Join our creative team as a UX/UI designer...',
          requirements: ['Figma', 'Adobe Creative Suite', 'User Research', '3+ years experience'],
          postedBy: 'emp2',
          postedDate: '2024-01-10',
          deadline: '2024-02-10',
          status: 'active'
        }
      ];
      setJobs(sampleJobs);
      localStorage.setItem('jobs', JSON.stringify(sampleJobs));
    }
    
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(job =>
      job.id === jobId ? { ...job, ...updates } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const deleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const applyToJob = (jobId: string, applicationData: Omit<Application, 'id' | 'appliedDate'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const getJobsByEmployer = (employerId: string) => {
    return jobs.filter(job => job.postedBy === employerId);
  };

  const getApplicationsByJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getApplicationsByApplicant = (applicantId: string) => {
    return applications.filter(app => app.applicantId === applicantId);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      applyToJob,
      updateApplicationStatus,
      getJobsByEmployer,
      getApplicationsByJob,
      getApplicationsByApplicant
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}