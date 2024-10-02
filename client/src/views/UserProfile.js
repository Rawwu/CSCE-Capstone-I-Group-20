import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from 'aws-amplify/auth';

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = await getCurrentUser();
        const userId = user.attributes.sub; // Cognito UserID
        
        const response = await axios.get(`https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/user-bookings?userId=${userId}`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.bookingId}>
              Booking ID: {booking.bookingId}
              {/* Display other details like flight, date, etc. */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default UserProfile;
