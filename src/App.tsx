import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSearch from './pages/JobSearch';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Register />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route 
          path="/jobseeker-dashboard" 
          element={user && user.role === 'jobseeker' ? <JobSeekerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/employer-dashboard" 
          element={user && user.role === 'employer' ? <EmployerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <AppContent />
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;