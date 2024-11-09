import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { confirmUserAttribute, fetchUserAttributes, getCurrentUser, updateUserAttributes } from 'aws-amplify/auth';
import './UserProfile.css'
import airlines from './../airlines.json';

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [userAttributes, setUserAttributes] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState({});
  const [confirmationCode, setConfirmationCode] = useState('');

  const [distancesByAirline, setDistancesByAirline] = useState({})

  const updateUserAttr = async () => {
    const res = await updateUserAttributes({
      userAttributes: {
        name: userAttributes.name,
        email: userAttributes.email,
        phone_number: userAttributes.phone_number
      },
    });
    setUpdatedStatus(res)
    console.log(userAttributes, res)
  }

  const handleProfileChange = () => {
    if (isChanging) {
      updateUserAttr()
    }
    setIsChanging(!isChanging);
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission
    try {
      const result = await confirmUserAttribute({
        userAttributeKey: 'email',
        confirmationCode: confirmationCode
      });
      window.location.reload()
    } catch (error) {
      console.error("Error confirming attribute:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = await getCurrentUser();

        const userId = user.signInDetails.loginId; // Cognito UserID

        const response = await axios.get(`https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/user-bookings?userId=${userId}`);
        setBookings(response.data);
        console.log(response.data);
        const flights = response.data.map(booking => JSON.parse(booking.flightDetails))[0].flatMap((offer) =>
          offer.itineraries.flatMap((itinerary) =>
            itinerary.segments.map((segment) => ({
              from: segment.departure.iataCode,
              to: segment.arrival.iataCode,
              airline: segment.carrierCode
            }))
          )
        );
        console.log(flights)

        const distancesByAirlines = {};

        // Collect all distances asynchronously
        await Promise.all(
          flights.map(async (flight) => {
            const options = {
              method: 'POST',
              url: 'https://airportgap.com/api/airports/distance',
              headers: { 'content-type': 'application/json' },
              data: flight
            };

            try {
              const { data } = await axios.request(options);
              const miles = Math.round(data.data.attributes.miles);
              const airline = flight.airline;
              console.log(data, 'data' ,airline)

              // Sum distances by airline
              if (distancesByAirlines[airline]) {
                distancesByAirlines[airline] += miles;
              } else {
                distancesByAirlines[airline] = miles;
              }
            } catch (error) {
              console.error(`Error calculating distance for flight: ${flight.id}`, error);
            }
          })
        );
        setDistancesByAirline(distancesByAirlines)
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      const attr = await fetchUserAttributes()
      console.log(attr)
      setUserAttributes(attr)
    }

    fetchAttributes()
  }, [])

  console.log(distancesByAirline)
  return (
    <div>
      <section>
        <div className='profile-header'>
          <h2>Profile</h2>
          <div className='change-btn' onClick={handleProfileChange}>
            {
              isChanging ? 'Save' : 'Change'
            }
          </div>
        </div>
        <section>
          <div>
            <label htmlFor="full_name">Full name:</label>
            <input
              type="text"
              id="full_name"
              placeholder="Enter your full name"
              className='user-input'
              defaultValue={userAttributes.name}
              disabled={!isChanging} //if is changing do not disable
              onChange={(e) => setUserAttributes((prev) => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </div>

          <div>
            <label htmlFor="phone_number">Phone:</label>
            <input
              type="text"
              id="phone_number"
              placeholder="Enter your phone number"
              className='user-input'
              defaultValue={userAttributes.phone_number}
              disabled={!isChanging} //if is changing do not disable
              onChange={(e) => setUserAttributes((prev) => ({
                ...prev,
                phone_number: e.target.value
              }))}
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className='user-input'
              id="email"
              defaultValue={userAttributes.email}
              disabled={!isChanging} //if is changing do not disable
              onChange={(e) => setUserAttributes((prev) => ({
                ...prev,
                email: e.target.value
              }))}
            />
          </div>

          {
            (updatedStatus.email && updatedStatus.email.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE") &&
            <form onSubmit={handleSubmit}>
              <label htmlFor="confirmationCode">Confirmation code:</label>
              <input
                type="text"
                className='user-input'
                id="confirmationCode"
                placeholder='Enter confirmation code'
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
              <button type='submit'>Submit</button>
            </form>
          }
        </section>
      </section>

      <section>
        <h2>Loyalty Program</h2>

        {Object.keys(distancesByAirline).length > 0 ? (
          <div className='loyalty-box'>
            {Object.entries(distancesByAirline).map(([airline, data]) => (
              <div key={airline} className='loyalty-card'>
                <img src={airlines.find(a => a.id === airline).logo} />
                <div>
                  <div className='title'>{airlines.find(a => a.id === airline).name}</div>
                  <div>{data / 100} miles earned | Total passed: {data} miles</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No flight data available.</p>
        )}
      </section>

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

