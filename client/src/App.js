import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminTemplateUploadPage from './pages/AdminTemplateUploadPage';
import AdminTipsUploadPage from './pages/AdminTipsUploadPage';
import AdminMaterialsUploadPage from './pages/AdminMaterialsUploadPage';
import AdminQuizManagementPage from './pages/AdminQuizManagementPage';
import AdminExperienceApprovalPage from './pages/AdminExperienceApprovalPage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';

// User Layout and Pages
import UserLayout from './components/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import TakeQuiz from './pages/user/TakeQuiz';
import StudyMaterial from './pages/user/StudyMaterial';
import ResumeBuilder from './pages/user/ResumeBuilder';
import ShareExperience from './pages/user/ShareExperience';
import Tips from './pages/user/Tips';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/templates" element={<AdminTemplateUploadPage />} />
        <Route path="/admin/tips" element={<AdminTipsUploadPage />} />
        <Route path="/admin/materials" element={<AdminMaterialsUploadPage />} />
        <Route path="/admin/quizzes" element={<AdminQuizManagementPage />} />
        <Route path="/admin/experiences" element={<AdminExperienceApprovalPage />} />
        <Route path="/admin/users" element={<AdminManageUsersPage />} />

        {/* User Routes with Layout */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="quiz" element={<TakeQuiz />} />
          <Route path="materials" element={<StudyMaterial />} />
          <Route path="resume" element={<ResumeBuilder />} />
          <Route path="experience" element={<ShareExperience />} />
          <Route path="tips" element={<Tips />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
