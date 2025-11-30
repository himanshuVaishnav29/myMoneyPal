import React from 'react';

const SkeletonCard = ({ gradient }) => {
  return (
    <div className={`${gradient} text-white p-6 rounded-lg shadow animate-pulse`}>
      <div className="h-5 bg-white/20 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-white/30 rounded w-1/2 mb-4"></div>
      <div className="h-16 bg-white/10 rounded mt-4"></div>
    </div>
  );
};

export default SkeletonCard;