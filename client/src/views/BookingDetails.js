import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/bookingConfirmation.css';
import airlineLogos from '../assets/airlineLogos';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, email } = location.state || {}; // Retrieve booking data passed from previous page

  if (!booking) {
    return <div>Error: Booking details not available.</div>;
  }

  // Parse flightDetails JSON string
  const flightDetails = JSON.parse(booking.flightDetails);
  const travelers = JSON.parse(booking.travelers);

  if (!flightDetails || flightDetails.length === 0) {
    return <div>Error: No flight details available.</div>;
  }

  // Extract relevant details from the parsed flightDetails
  const { travelerPricings, itineraries, price, validatingAirlineCodes  } = flightDetails[0];
  const departureSegments = itineraries[0]?.segments || [];
  const returnSegments = itineraries[1]?.segments || [];
  const airlineLogo = airlineLogos[validatingAirlineCodes[0]] || '/images/logos/default.png';

  const handleCancelBooking = async () => {
    try {
      await axios.delete('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/delete-booking', {
        data: { bookingId: booking.bookingId, email }
      });
      alert('Booking successfully canceled.');
      navigate('/');  // Redirect to home after cancellation
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Error canceling booking. Please try again.');
    }
  };

  return (
    <div className="confirmation-container">
      <h1 className="confirmation-title">Your Booking</h1>
      <div className="card booking-info-card">
        <h2>Booking Information</h2>
        <p><strong>Booking ID:</strong> {booking.bookingId}</p>
        <p><strong>Total Price:</strong> ${price.total}</p>
      </div>

      <div className="card">
        <h2 className="section-title">Passenger Details:</h2>
        <ul className="traveler-list">
          {travelers.map((traveler, index) => (
            <li key={index}>
              {traveler.name.firstName} {traveler.name.lastName} - {traveler.contact.emailAddress}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="section-title">Flight Details:</h2>

        <div className="flight-section">
          <div className="sub-section-title-container">
            <h3 className="sub-section-title">Departure Flight:</h3>
            <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo" />
          </div>

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
        </div>

        <div className="flight-section">
          <div className="sub-section-title-container">
            <h3 className="sub-section-title">Return Flight:</h3>
            <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo" />
          </div>

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
        </div>
      </div>

      <div className="button-container">
        <button className="btn btn-danger" onClick={handleCancelBooking}>Cancel Booking</button>
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

export default BookingDetails;