import React from 'react';
import '../styles/seatMap.css';

const Facility = ({ code, coordinates }) => {
  // Check if coordinates exist and handle the case where they might be missing
  if (!coordinates) return null;

  const left = `${coordinates.y * 2}em`;
  const top = `${coordinates.x * 2}em`;

  return (
    <div className='facility' style={{ position: "absolute", left: left, top: top, backgroundColor: "#F5EE9E" }}>
      <p>{code}</p>
    </div>
  );
};

export default Facility;
