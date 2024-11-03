import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/bookingConfirmation.css';
import { useLocation } from 'react-router-dom';

const BookingConfirmation = () => {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      let bookingId = urlParams.get('bookingId');

      // Ensure bookingId is properly URL-encoded
      if (bookingId) {
        bookingId = encodeURIComponent(bookingId);
      }

      if (email && bookingId) {
        console.log('Email:', email);
        console.log('Encoded Booking ID:', bookingId);

        try {
          const response = await axios.get(
            `https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/find-booking`,
            {
              params: { bookingId, email },
            }
          );

          // console.log('API Response:', response.data);

          if (response.data && response.data.flightDetails) {
            const parsedBooking = {
              ...response.data,
              flightDetails: JSON.parse(response.data.flightDetails || '[]'),
            };
            setBooking(parsedBooking);
          } else {
            setError('Booking not found or missing flight details.');
          }
        } catch (err) {
          console.error('Error retrieving booking details:', err.message);
          setError('Failed to retrieve booking details.');
        }
      } else {
        setError('Missing booking information.');
      }
    };

    if (location.search) {
      fetchBookingDetails();
    }
  }, [location.search]);

  if (error) return <div>{error}</div>;
  if (!booking) return <div>Loading...</div>;

  const { bookingId, flightDetails } = booking;
  const { travelerPricings, itineraries } = flightDetails[0] || {};

  return (
    <div className="confirmation-box">
      <h1 className="confirmation-title">Booking Confirmation</h1>
      <p className="confirmation-id">Booking ID: <strong>{bookingId}</strong></p>
      <p className="booking-message">Your flight has been booked!</p>

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
                <h4 className="flight-date-title">
                  {new Date(segment.departure.at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h4>
                <p className="flight-route">{`${segment.departure.iataCode} -> ${segment.arrival.iataCode}`}</p>
                <p><strong>Departure:</strong> {segment.departure.iataCode} (Terminal: {segment.departure.terminal}) at {new Date(segment.departure.at).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {segment.arrival.iataCode} (Terminal: {segment.arrival.terminal}) at {new Date(segment.arrival.at).toLocaleString()}</p>
                <p><strong>Flight Number:</strong> {segment.carrierCode} {segment.number}</p>
                <p><strong>Class:</strong> {travelerPricings[0]?.fareDetailsBySegment[segIndex]?.cabin}</p>
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