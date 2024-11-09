import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindBooking = () => {
    const [bookingId, setBookingId] = useState('');
    const [email, setEmail] = useState('');
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFindBooking = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.get(`https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/find-booking`, {
                params: { bookingId, email }
            });
            setBooking(response.data);
            navigate('/booking-details', { state: { booking: response.data } }); // Redirect to confirmation page
        } catch (err) {
            setError('Booking not found or error retrieving booking.');
        }
    };

    return (
        <div className="find-booking-container">
            <h2>Find Your Booking</h2>
            <form onSubmit={handleFindBooking}>
                <div className="form-group">
                    <label htmlFor="bookingId">Booking ID:</label>
                    <input
                        type="text"
                        id="bookingId"
                        className="form-control"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary">Find Booking</button>
            </form>
        </div>
    );
};

export default FindBooking;
