import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/bookingConfirmation.css';
import airlineLogos from '../assets/airlineLogos';
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

  const { bookingId, flightDetails  } = booking;
  const travelers = JSON.parse(booking.travelers);
  const { travelerPricings, itineraries, validatingAirlineCodes } = flightDetails[0] || {};
  const departureSegments = itineraries[0]?.segments || [];
  const returnSegments = itineraries[1]?.segments || [];
  const airlineLogo = airlineLogos[validatingAirlineCodes[0]] || '/images/logos/default.png';

  return (
    <div className="confirmation-container">
      <h1 className="confirmation-title">Booking Confirmation</h1>
        <div className="card booking-info-card">
            <h2>Booking Information</h2>
            <p><strong>Booking ID:</strong> {bookingId}</p>
            <p className="booking-message">Your flight has been successfully booked!</p>
        </div>

      <div className="card">
      <h2 className="section-title">Passenger Details:</h2>
      <ul className="traveler-list">
        {travelers && travelers.length > 0 ? (
          travelers.map((traveler, index) => (
            <li key={index}>
              {traveler.name.firstName} {traveler.name.lastName} - {traveler.contact.emailAddress}
            </li>
          ))
        ) : (
          <li>No passenger information available</li>
        )}
      </ul>
      </div>

      <div className="card">
      <h2 className="section-title">Flight Details:</h2>

      <div className="flight-section">
        <div className="sub-section-title-container">
            <h3 className="sub-section-title">Departure Flight:</h3>
            <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo" />
        </div>

        {departureSegments.length > 0 ? (
          <table className="flight-details-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Route</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Flight Number</th>
                <th>Class</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {departureSegments.map((segment, index) => (
                <tr key={index}>
                  <td>
                    {new Date(segment.departure.at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td>{`${segment.departure.iataCode} -> ${segment.arrival.iataCode}`}</td>
                  <td>{new Date(segment.departure.at).toLocaleTimeString()}</td>
                  <td>{new Date(segment.arrival.at).toLocaleTimeString()}</td>
                  <td>{`${segment.carrierCode} ${segment.number}`}</td>
                  <td>{travelerPricings[0]?.fareDetailsBySegment[index]?.cabin}</td>
                  <td>{calculateDuration([segment])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No departure flight details available</p>
        )}
      </div>

      <div className="flight-section">
        <div className="sub-section-title-container">
            <h3 className="sub-section-title">Return Flight:</h3>
            <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo" />
        </div>

        {returnSegments.length > 0 ? (
          <table className="flight-details-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Route</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Flight Number</th>
                <th>Class</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {returnSegments.map((segment, index) => (
                <tr key={index}>
                  <td>
                    {new Date(segment.departure.at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td>{`${segment.departure.iataCode} -> ${segment.arrival.iataCode}`}</td>
                  <td>{new Date(segment.departure.at).toLocaleTimeString()}</td>
                  <td>{new Date(segment.arrival.at).toLocaleTimeString()}</td>
                  <td>{`${segment.carrierCode} ${segment.number}`}</td>
                  <td>{travelerPricings[0]?.fareDetailsBySegment[index]?.cabin}</td>
                  <td>{calculateDuration([segment])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No return flight details available</p>
        )}
      </div>
      </div>
      <h3 className="thank-you-message">Thank you for booking with SIFT!</h3>
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