import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/flightDetails.css';
import SeatMap from '../components/SeatMap.js';

const FlightDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {};
    const { itineraries, price, validatingAirlineCodes } = flight;

    const [selectedSeats, setSelectedSeats] = useState({});
    const [confirmedPrice, setConfirmedPrice] = useState(null);
    const [seatMapData, setSeatMapData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeSegment, setActiveSegment] = useState(0);
    const [hasFetchedSeatMap, setHasFetchedSeatMap] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1); // Default to 1 passenger

    useEffect(() => {
        if (location.state && location.state.passengerCount) {
            setPassengerCount(location.state.passengerCount);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchSeatMap = async () => {
            if (hasFetchedSeatMap) return;
            try {
                setIsLoading(true);
                const response = await axios.post('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/seatmap', {
                    flightOffer: flight
                });
                setSeatMapData(response.data.length > 0 ? response.data : null);
                setHasFetchedSeatMap(true);
            } catch (error) {
                console.error('Error fetching seat map:', error);
                setSeatMapData(null);
                setErrorMessage('Unable to retrieve seat map. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (flight && !hasFetchedSeatMap) {
            fetchSeatMap();
        }
    }, [flight, hasFetchedSeatMap]);

    const confirmPrice = async () => {
        try {
            if (!flight || !flight.itineraries) {
                setErrorMessage('Invalid flight data. Please try again.');
                return;
            }
    
            const updatedFlightOffer = {
                ...flight,
                itineraries: (flight.itineraries || []).map((itinerary, itineraryIndex) => ({
                    ...itinerary,
                    segments: (itinerary.segments || []).map((segment, segIndex) => {
                        let updatedFareDetails = (segment.travelerPricings || []).map(traveler => {
                            if (!traveler.fareDetailsBySegment) return traveler;
    
                            return {
                                ...traveler,
                                fareDetailsBySegment: (traveler.fareDetailsBySegment || []).map(detail => {
                                    let newDetails = { ...detail };
                                    const seatForSegment = selectedSeats[`${itineraryIndex}-${segIndex}`];
                                    if (seatForSegment) {
                                        newDetails.additionalServices = {
                                            ...newDetails.additionalServices,
                                            chargeableSeatNumber: seatForSegment.number
                                        };
                                    }
                                    return newDetails;
                                })
                            };
                        });
    
                        return {
                            ...segment,
                            travelerPricings: updatedFareDetails
                        };
                    })
                }))
            };
    
            const response = await axios.post('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/price-flight', {
                flightOffer: updatedFlightOffer
            });
    
            const confirmedPrice = response.data;
            setConfirmedPrice(confirmedPrice);
    
            const priceBreakdown = confirmedPrice.flightOffers[0].price.breakdown;
            navigate('/booking', { 
                state: { 
                    flight: confirmedPrice.flightOffers[0], 
                    selectedSeats, 
                    priceBreakdown,
                    passengers: passengerCount 
                } 
            });
        } catch (error) {
            console.error('Error confirming flight price:', error);
            setErrorMessage('Unable to confirm the price. Please try again.');
        }
    };

    const handleSeatSelection = (seat, itineraryIndex, segIndex) => {
        if (!seat) return;
        setSelectedSeats(prevSeats => ({
            ...prevSeats,
            [`${itineraryIndex}-${segIndex}`]: seat
        }));
    };

    const handleNextSegment = () => {
        if (activeSegment < seatMapData.length - 1) {
            setActiveSegment(activeSegment + 1);
        }
    };

    const handlePreviousSegment = () => {
        if (activeSegment > 0) {
            setActiveSegment(activeSegment - 1);
        }
    };

    return (
        <div className="details-box">
            <div className="flight-summary">
                <h3>Flight Details</h3>
                {itineraries.map((itinerary, idx) => (
                    <div key={idx}>
                        {itinerary.segments.map((segment, segIdx) => (
                            <div key={segIdx} className="flight-segment">
                                <p>{`${segment.departure.iataCode} → ${segment.arrival.iataCode}`}</p>
                                <p>{`Carrier: ${segment.carrierCode}`}</p>
                                <p>{`Flight Number: ${segment.flightNumber}`}</p>
                            </div>
                        ))}
                    </div>
                ))}
                <p><strong>Total Price:</strong> {price.total} {price.currency}</p>
            </div>

            {isLoading ? (
                <div className="loading-indicator">Loading seat map, please wait...</div>
            ) : (
                seatMapData ? (
                    <div className="seat-map-container">
                        <h4>Select Your Seat (Segment {activeSegment + 1} of {seatMapData.length})</h4>
                        <SeatMap 
                            seatMapData={seatMapData[activeSegment]} 
                            onSeatSelect={(seat) => handleSeatSelection(seat, activeSegment, 0)} 
                            selectedSeat={selectedSeats[`${activeSegment}-0`]}
                        />
                        <div className="navigation-buttons">
                            <button onClick={handlePreviousSegment} disabled={activeSegment === 0}>Previous</button>
                            <button onClick={handleNextSegment} disabled={activeSegment === seatMapData.length - 1}>Next</button>
                        </div>
                    </div>
                ) : (
                    <p>Seat Map Not Available for this flight</p>
                )
            )}

            <div className="confirm-button text-center mt-4">
                <button onClick={confirmPrice}>Confirm Price and Proceed to Booking</button>
            </div>
        </div>
    );
};

export default FlightDetails;