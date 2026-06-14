import React from 'react';
import '../styles/FeatureCard.css';

const FeatureCard = ({ title, image, details }) => {
  return (
    <div className="feature-card">
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <h3>{title}</h3>
      <p>{details}</p>
    </div>
  );
};

export default FeatureCard;
