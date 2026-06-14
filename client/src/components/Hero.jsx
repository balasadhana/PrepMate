import React from 'react';
import '../styles/Hero.css'; // Corrected path

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Interview Success Begins Here</h1>
        <p>Practice. Prepare. Prevail with PrepMate – Your All-in-One Interview Preparation Platform.</p>
        <button className="get-started">Get Started</button>
      </div>
    </section>
  );
};

export default Hero;
