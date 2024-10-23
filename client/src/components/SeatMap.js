import React from 'react';
import Deck from './Deck';
import '../styles/seatMap.css';

const SeatMap = ({ seatMapData, onSeatSelect, selectedSeat }) => {
    const handleSeatSelection = (seat) => {
        onSeatSelect(seat);
    };

    return (
        <div className="seat-section">
            {seatMapData?.decks?.map((deck, deckIndex) => (
                <Deck 
                    key={deckIndex} 
                    deck={deck} 
                    onSeatSelect={handleSeatSelection} 
                    selectedSeat={selectedSeat} 
                />
            ))}
        </div>
    );
};

export default SeatMap;
