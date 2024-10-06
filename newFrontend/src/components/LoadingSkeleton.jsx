import React from 'react';
import './LoadingSkeleton.css'; 

const LoadingSkeleton = () => {
  return (
    <div className="loading-container">
      <div className="loader">
        <span className="loader-text">loading...</span>
        <span className="load"></span>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
