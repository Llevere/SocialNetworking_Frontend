import React from 'react';
//import './Loading.css'; // Make sure to import your CSS file

function Loading() {
  return (
    <div className="loading-container">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="loading-block" />
      ))}
    </div>
  );
}

export default Loading;