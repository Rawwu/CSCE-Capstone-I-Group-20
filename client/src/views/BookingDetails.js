import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/bookingConfirmation.css';  // Custom CSS for booking confirmation

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, email } = location.state || {}; // Retrieve booking data passed from previous page

  if (!booking) {
    return <div>Error: Booking details not available.</div>;
  }

  // Parse flightDetails JSON string
  const flightDetails = JSON.parse(booking.flightDetails);

  if (!flightDetails || flightDetails.length === 0) {
    return <div>Error: No flight details available.</div>;
  }

  // Extract relevant details from the parsed flightDetails
  const { travelerPricings, itineraries, price } = flightDetails[0];


  const handleCancelBooking = async () => {
    try {
      await axios.delete('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/delete-booking', {
        data: { bookingId: booking.bookingId, email }
      });
      alert('Booking successfully canceled.');
      navigate('/');  // Redirect to home or another page after cancellation
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Error canceling booking. Please try again.');
    }
  };

  return (
    <div className="confirmation-box">
      <h1 className="confirmation-title">Booking Confirmation</h1>
      <p className="confirmation-id">Booking ID: <strong>{booking.bookingId}</strong></p>
      <p className="booking-message">Your flight has been confirmed!</p> {/* Confirmation message */}

      <h2 className="section-title">Traveler Information:</h2>
      <ul className="traveler-list">
        {travelerPricings?.length > 0 ? (
          travelerPricings.map((traveler, index) => (
            <li key={index} className="traveler-item">
              Traveler {traveler.travelerId}: {traveler.travelerType} - Fare: {traveler.fareOption}
            </li>
          ))
        ) : (
          <li>No traveler information available</li>
        )}
      </ul>

      <h2 className="section-title">Flight Details:</h2>
      {itineraries?.length > 0 ? (
        itineraries.map((itinerary, itinIndex) => (
          <div key={itinIndex} className="flight-details">
            {itinerary.segments.map((segment, segIndex) => (
              <div key={segIndex} className="segment-details">
                <h4 className="flight-date-title">{`${new Date(segment.departure.at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}</h4>
                <p className="flight-route">{`${segment.departure.iataCode} -> ${segment.arrival.iataCode}`}</p>

                <p><strong>Departure:</strong> {segment.departure.iataCode} (Terminal: {segment.departure.terminal}) at {new Date(segment.departure.at).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {segment.arrival.iataCode} (Terminal: {segment.arrival.terminal}) at {new Date(segment.arrival.at).toLocaleString()}</p>
                <p><strong>Flight Number:</strong> {segment.carrierCode} {segment.number}</p>
                <p><strong>Class:</strong> {travelerPricings[0].fareDetailsBySegment[segIndex].cabin}</p>
                <p><strong>Number of Stops:</strong> {segment.numberOfStops}</p>
                <p><strong>Duration:</strong> {calculateDuration(itinerary.segments)}</p>
                <hr />
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No flight details available</p>
      )}

      <h3 className="thank-you">Thank you for choosing our service!</h3>
      <button className="btn btn-danger" onClick={handleCancelBooking}>Cancel Booking</button>
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

export default BookingDetails;