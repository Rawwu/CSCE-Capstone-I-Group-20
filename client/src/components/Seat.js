import React from 'react';
import '../styles/seatMap.css';

const Seat = ({ number, x, y, availability, onSeatSelect, isSelected }) => {
    // Use availability to determine the class (fallback to 'unavailable' if undefined)
    const seatClass = availability === 'AVAILABLE' ? 'available' : 'unavailable';
  
    // Check if x and y coordinates are available
    if (x == null || y == null) return null;
  
    const style = {
        position: "absolute",
        left: `${y * 2}em`,
        top: `${x * 2}em`,
    };
  
    const handleClick = () => {
        if (availability === 'AVAILABLE') {
            onSeatSelect({ number, x, y });
        }
    };
  
    return (
        <div
            className={`seat ${seatClass} ${isSelected ? 'selected' : ''}`}
            style={style}
            onClick={handleClick}
        >
            {number}
        </div>
    );
};

export default Seat;
