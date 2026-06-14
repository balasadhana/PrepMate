import React from 'react';
import './styles/Features.css';

const Features = () => {
  return (
    <section className="features" id="features">
      <h2>Why PrepMate?</h2>
      <div className="feature-grid">
        <div className="feature-card">🧠 Practice MCQs</div>
        <div className="feature-card">📄 Build Resumes</div>
        <div className="feature-card">🎤 Mock Interviews</div>
        <div className="feature-card">📚 Tips & Resources</div>
        <div className="feature-card">📊 Progress Tracker</div>
        <div className="feature-card">📅 Schedule Interviews</div>
      </div>
    </section>
  );
};

export default Features;
