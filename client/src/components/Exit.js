import React from 'react';
import '../styles/seatMap.css';

const Exit = ({ row, deckWidth }) => {
  const styleLeft = {
    position: "absolute",
    left: "-4.1em",
    top: `${row * 2}em`,
    backgroundColor: "#499167",
  };

  // Dynamically calculate the right side exit position based on deck width
  const styleRight = {
    position: "absolute",
    left: `${deckWidth - 4.1}em`, // Adjust based on deck width
    top: `${row * 2}em`,
    backgroundColor: "#499167",
  };

  return (
    <div className="exit">
      <span style={styleLeft}>EXIT</span>
      <span style={styleRight}>EXIT</span>
    </div>
  );
};

export default Exit;
