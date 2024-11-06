import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/flightDetails.css';
import airlineLogos from '../assets/airlineLogos';
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
    const [passengerCount, setPassengerCount] = useState(1);
    const airlineLogo = airlineLogos[validatingAirlineCodes[0]] || '/images/logos/default.png';

    useEffect(() => {
        if (location.state && location.state.passengerCount) {
            setPassengerCount(location.state.passengerCount);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchSeatMap = async () => {
            if (hasFetchedSeatMap || !flight) return;

            try {
                setIsLoading(true);
                const response = await axios.post('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/seatmap', {
                    flightOffer: flight
                });

                if (response.data.length > 0) {
                    setSeatMapData(response.data);
                    setHasFetchedSeatMap(true);
                } else {
                    setSeatMapData(null);
                    setErrorMessage('Seat Map Not Available for this flight');
                }
            } catch (error) {
                console.error('Error fetching seat map:', error);
                setErrorMessage('Seat Map Not Available for this flight');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeatMap();
    }, [flight, hasFetchedSeatMap]);

    const confirmPrice = async () => {
        try {
            if (!flight || !flight.itineraries) {
                setErrorMessage('Invalid flight data. Please try again.');
                return;
            }
    
            const isTestMode = true; // Set to 'true' to skip seat details in the API call
    
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
                                    if (seatForSegment && !isTestMode) { // Skip adding seat details in test mode
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
            <div className="details-header">
                <h2>Flight Details</h2>
                {price && <div className="header-right"><p><strong>Total Price:</strong> ${price.total}</p></div>}
            </div>

            {itineraries ? itineraries.map((itinerary, idx) => (
            <div key={idx} className="itinerary">
                <h3>Itinerary {idx + 1}</h3>
                {itinerary.segments.map((segment, segIdx) => {
                    // Find the matching fare detail by segment ID
                    const matchingFareDetail = flight.travelerPricings?.[0]?.fareDetailsBySegment?.find(
                        fareDetail => fareDetail.segmentId === segment.id
                    );

                    return (
                        <div key={segIdx} className="flight-segment">
                            <h4>{new Date(segment.departure.at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                            <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo me-3" />
                            <p><strong>{segment.departure.iataCode} → {segment.arrival.iataCode}</strong></p>
                            <p><strong>Flight:</strong> {segment.carrierCode} {segment.number}</p>
                            <p><strong>Departure:</strong> {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleTimeString()}</p>
                            <p><strong>Arrival:</strong> {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleTimeString()}</p>
                            <p><strong>Class:</strong> {matchingFareDetail ? matchingFareDetail.cabin : 'N/A'}</p>
                            <p><strong>Duration:</strong> {calculateDuration(itinerary.segments)}</p>
                        </div>
                    );
                })}
                {idx < itineraries.length - 1 && <hr className="itinerary-divider" />}
            </div>
            )) : <p>No flight details available.</p>}


            {isLoading ? (
                <div className="loading-indicator">Loading seat map, please wait...</div>
            ) : seatMapData ? (
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
                <p>{errorMessage}</p>
            )}

            <div className="confirm-button text-center mt-4">
                <button onClick={confirmPrice}>Confirm Price and Proceed to Booking</button>
            </div>
        </div>
    );
};

// Helper function to calculate flight duration
const calculateDuration = (segments) => {
    const departure = segments[0].departure.at;
    const arrival = segments[segments.length - 1].arrival.at;
    const durationMs = new Date(arrival) - new Date(departure);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hr ${minutes} min`;
};

export default FlightDetails;