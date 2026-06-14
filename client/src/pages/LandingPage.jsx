import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1: import useNavigate
import '../styles/LandingPage.css';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    title: 'Progress Tracking',
    image: 'https://cdn-icons-png.flaticon.com/512/15439/15439246.png',
    details: 'Track your daily interview prep, scores and improvement over time.'
  },
  {
    title: 'Resume Builder',
    image: 'https://cdn-icons-png.flaticon.com/512/942/942748.png',
    details: 'Craft professional resumes with built-in templates and expert tips.'
  },
  {
    title: 'Mock Interview Questions',
    image: 'https://cdn-icons-png.flaticon.com/512/6403/6403868.png',
    details: 'Practice top questions asked in real interviews and get AI suggestions.'
  },
  {
    title: 'MCQ Practice',
    image: 'https://cdn-icons-png.flaticon.com/512/11725/11725738.png',
    details: 'Solve aptitude and technical MCQs across various categories.'
  },
  {
    title: 'Industry Tips',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    details: 'Read expert career advice and latest interview trends.'
  },
  {
    title: 'Profile Page',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135717.png',
    details: 'Create a clean candidate profile for recruiters to view your skills.'
  },
  {
    title: 'Share Interview Experience',
    image: 'https://cdn-icons-png.flaticon.com/512/3870/3870822.png',
    details: 'Share your real interview stories to help others prepare better.'
  }
];

const LandingPage = () => {
  const navigate = useNavigate(); // ✅ Step 2: get navigate function

  return (
    <div className="landing-page">
      <header className="header">
        <div className="top-bar">
          <h1 className="main-title">Ace Your Interview with <span>PrepMate</span></h1>
          <div className="auth-buttons">
            <button className="btn login" onClick={() => navigate('/login')}>
             Login
            </button>
            <button className="btn signup" onClick={() => navigate('/signup')}>
              Signup
            </button>
          </div>
        </div>
        <p className="description">
          PrepMate is your one-stop platform to get ready for tech interviews with mock questions,
          progress tracking, expert tips, resume builder, and more!
        </p>
      </header>

      <div className="card-grid">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
