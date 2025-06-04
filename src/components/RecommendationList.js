// src/components/RecommendationList.js
import React from 'react';

const RecommendationList = ({ text }) => {
  return (
    <div className="recommendations">
      <h2>Recommended Meals & Restaurants</h2>
      <pre>{text}</pre> {/* You can format this further later */}
    </div>
  );
};

export default RecommendationList;
