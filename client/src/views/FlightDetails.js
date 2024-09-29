import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/flightDetails.css';  // Custom CSS for flight details

const FlightDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight, previousFlights } = location.state || {};

    const { itineraries, price, validatingAirlineCodes } = flight;

    // Helper to format time
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const calculateDuration = (departure, arrival) => {
        const durationMs = new Date(arrival) - new Date(departure);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hr ${minutes} min`;
    };

    // Use previousFlights for displaying search results or handle navigation back
    const goBack = () => {
        if (previousFlights) {
            navigate('/search-flights', { state: { flights: previousFlights } });
        } else {
            navigate(-1);
        }
    };

    // Get city information from the flight itineraries
    const origin = itineraries[0].segments[0].departure.iataCode; // First segment's departure code
    const destination = itineraries[0].segments[itineraries[0].segments.length - 1].arrival.iataCode; // Last segment's arrival code

    return (
        <div className="details-box">
            <div className="details-header">
                {/* Heading - City Information */}
                <div className="header-left">
                    <h4>{origin} <strong>⇄</strong> {destination}</h4>
                </div>
                <div className="header-right">
                    <p>Round trip - Economy <span className="price">${price.grandTotal}</span></p>
                </div>
            </div>

            {itineraries.map((itinerary, index) => (
                <div className="itinerary" key={index}>
                    <h5>{validatingAirlineCodes[0]} {'-'} {index === 0 ? 'Departing flight' : 'Returning flight'} {new Date(itinerary.segments[0].departure.at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h5>

                    {itinerary.segments.map((segment, segIndex) => (
                        <div key={segIndex} className="segment">
                            <p className="flight-time">
                                {formatDateTime(segment.departure.at)} <strong>→</strong> {formatDateTime(segment.arrival.at)}
                            </p>
                            <p className="flight-airport">
                                {segment.departure.iataCode} <span className="dot">•</span> {segment.arrival.iataCode}
                            </p>
                            <p className="flight-duration">
                                Travel time: {calculateDuration(segment.departure.at, segment.arrival.at)}
                            </p>

                            {itinerary.segments.length > 1 && segIndex !== itinerary.segments.length - 1 && (
                                <p className="layover">Layover: {segment.arrival.iataCode}</p>
                            )}
                        </div>
                    ))}

                    {index < itineraries.length - 1 && <hr className="itinerary-divider" />}
                </div>
            ))}

            {/* Additional Information Box */}
            <div className="additional-info-box">
                <p>- 1 carry-on bag available for a fee</p>
                <p>- 1st checked bag available for a fee</p>
            </div>

            {/* Back button */}
            <div className="back-button text-center mt-4">
                <button className="btn btn-secondary" onClick={goBack}>Back to search results</button>
            </div>
        </div>
    );
};

export default FlightDetails;
