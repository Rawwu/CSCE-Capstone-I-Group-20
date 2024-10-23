import React from 'react';
import Seat from './Seat'; // Import Seat for rendering individual seats
import '../styles/seatMap.css';

const SeatRow = ({ seatsInRow, rowNumber, onSeatSelect }) => {
  const leftSeats = seatsInRow.filter(seat => seat.coordinates.x <= 2); // Left section
  const rightSeats = seatsInRow.filter(seat => seat.coordinates.x > 3); // Right section

  return (
    <div className="seat-row">
      <div className="seat-row-label">Row {rowNumber}</div>
      <div className="seats">
        <div className="seat-group left">
          {leftSeats.map((seat, seatIndex) => (
            <Seat key={seatIndex} seat={seat} onSeatSelect={onSeatSelect} />
          ))}
        </div>
        <div className="aisle" /> {/* This is the aisle space */}
        <div className="seat-group right">
          {rightSeats.map((seat, seatIndex) => (
            <Seat key={seatIndex} seat={seat} onSeatSelect={onSeatSelect} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatRow;
