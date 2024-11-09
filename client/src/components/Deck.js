import React from 'react';
import Seat from './Seat';
import Facility from './Facility';
import Exit from './Exit';
import Wing from './Wing';
import '../styles/seatMap.css';

// Function to render seats based on their coordinates
const displaySeats = (seats = [], onSeatSelect, selectedSeat) => {
    return (
      <div>
        {seats.map((seat, index) => {
          const { coordinates, number, travelerPricing } = seat;
  
          // Extract fare details by segment from travelerPricing
          const fareDetails = travelerPricing?.[0]?.fareDetailsBySegment?.find(
            (details) => details.segmentId === seat.segmentId
          );
  
          const availability = travelerPricing?.[0]?.seatAvailabilityStatus;
          const cabin = fareDetails?.cabin;
          const brandedFare = fareDetails?.brandedFare;
          const classCode = fareDetails?.class;
          const includedBags = fareDetails?.includedCheckedBags?.quantity;
  
          // Apply 'selected' class if this seat is the selected seat
          const isSelected = selectedSeat?.number === number;
  
          return (
            <Seat
              key={index}
              number={number}
              x={coordinates?.x}
              y={coordinates?.y}
              availability={availability}
              cabin={cabin}
              brandedFare={brandedFare}
              classCode={classCode}
              includedBags={includedBags}
              onSeatSelect={onSeatSelect}
              isSelected={isSelected} // Pass the selected state to the Seat component
            />
          );
        })}
      </div>
    );
  };

// Function to render facilities
const displayFacilities = (facilities = []) => {
  return (
    <div id="facilities">
      {facilities.map((facility, index) => (
        <Facility
          key={index}
          code={facility.code}
          x={facility.coordinates?.x}
          y={facility.coordinates?.y}
        />
      ))}
    </div>
  );
};

// Function to render exits
const displayExits = (exitRows = [], deckWidth) => {
  return (
    <div>
      {exitRows.map((row, index) => (
        <Exit key={index} row={row} deckWidth={deckWidth} />
      ))}
    </div>
  );
};

// Function to render wings
const displayWings = (start, end) => {
  if (start === undefined || end === undefined) return null;
  return (
    <>
      <Wing orientation="left" start={start} end={end} />
      <Wing orientation="right" start={start} end={end} />
    </>
  );
};

const Deck = ({ deck = {}, onSeatSelect, selectedSeat }) => {
    const { width, length, startWingsX, endWingsX, exitRowsX = [] } = deck.deckConfiguration || {};
    const { seats = [], facilities = [] } = deck;
  
    return (
      <div
        className="deck"
        style={{
          width: `${(width || 0) * 2.2}em`,
          height: `${(length || 0) * 2.1}em`,
          position: 'relative',
        }}
      >
        {/* Render Wings */}
        {displayWings(startWingsX, endWingsX)}
  
        {/* Render Seats with selected seat */}
        {displaySeats(seats, onSeatSelect, selectedSeat)}
  
        {/* Render Facilities */}
        {displayFacilities(facilities)}
  
        {/* Render Exits */}
        {displayExits(exitRowsX)}
      </div>
    );
};

export default Deck;
