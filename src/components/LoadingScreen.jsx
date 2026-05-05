import React from 'react';

const LoadingScreen = ({ message = "Loading Dashboard" }) => {
  return (
    <div className="loading-container">
      <div className="premium-loader">
        <div className="loader-ring"></div>
        <div className="loader-pulse"></div>
      </div>
      <div className="loading-text">
        {message}
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
