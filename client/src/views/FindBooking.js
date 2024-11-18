import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/findbooking.css";

const FindBooking = () => {
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFindBooking = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.get(
        `https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/find-booking`,
        { params: { bookingId, email } }
      );
      navigate('/booking-details', {
        state: { booking: response.data, email },
      });
    } catch (err) {
      setError('Booking not found');
    }
  };

  return (
    <div className="findbooking-wrapper">
      <div className="findbooking-card">
        <h2>Find Your Booking</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleFindBooking}>
          <div className="form-div">
            <label>Booking ID</label>
            <input
              type="text"
              className="form-control"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
          </div>
          <div className="form-div">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-findbooking">
            Find Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindBooking;