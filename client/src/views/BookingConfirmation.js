import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/bookingConfirmation.css';  // Custom CSS for booking confirmation

const BookingConfirmation = () => {
  const location = useLocation();
  const { booking } = location.state || {}; // Retrieve booking data passed from previous page

  if (!booking) {
    return <div>Error: Booking confirmation details not available.</div>;
  }

  // Adjust destructuring based on the actual structure of booking
  const { id, travelers, flightOffers } = booking;

  return (
    <div className="confirmation-box">
      <h1 className="confirmation-title">Booking Confirmation</h1>
      <p className="confirmation-id">Booking ID: <strong>{id}</strong></p>
      <p className="booking-message">Your flight has been booked!</p> {/* New message */}

      <h2 className="section-title">Traveler Information:</h2>
      <ul className="traveler-list">
        {travelers.map((traveler, index) => (
          <li key={index} className="traveler-item">
            {traveler.name.firstName} {traveler.name.lastName}: {traveler.gender}
          </li>
        ))}
      </ul>

      <h2 className="section-title">Flight Details:</h2>
      {flightOffers.map((offer, index) => (
        <div key={index} className="flight-details">
          <p className="flight-price"><strong>Price:</strong> {offer.price.grandTotal} {offer.price.currency}</p>
          <h3 className="flight-itinerary-title">Itinerary:</h3>
          {offer.itineraries.map((itinerary, itinIndex) => (
            <div key={itinIndex} className="itinerary">
              {itinerary.segments.map((segment, segIndex) => (
                <div key={segIndex} className="segment-details">
                  <h4 className="flight-date-title">{`${new Date(segment.departure.at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}</h4>
                  <p className="flight-route">{`${segment.departure.iataCode} -> ${segment.arrival.iataCode}`}</p> {/* Flight route */}

                  <p><strong>Departure:</strong> {segment.departure.iataCode} (Terminal: {segment.departure.terminal}) at {new Date(segment.departure.at).toLocaleString()}</p>
                  <p><strong>Arrival:</strong> {segment.arrival.iataCode} (Terminal: {segment.arrival.terminal}) at {new Date(segment.arrival.at).toLocaleString()}</p>
                  <p><strong>Flight Number:</strong> {segment.carrierCode} {segment.number}</p>
                  <p><strong>Class:</strong> {offer.travelerPricings[0].fareDetailsBySegment[segIndex].cabin}</p>
                  <p><strong>Number of Stops:</strong> {segment.numberOfStops}</p>
                  <p><strong>Duration:</strong> {calculateDuration(itinerary.segments)}</p>
                  <hr />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      
      <h3 className="thank-you">Thank you for booking with SIFT!</h3>
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

export default BookingConfirmation;