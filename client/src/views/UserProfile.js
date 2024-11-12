import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { confirmUserAttribute, fetchUserAttributes, getCurrentUser, updateUserAttributes } from 'aws-amplify/auth';
import './UserProfile.css';
import airlines from './../airlines.json';

function formatDuration(isoDuration) {
  const hoursMatch = isoDuration.match(/(\d+)H/);
  const minutesMatch = isoDuration.match(/(\d+)M/);

  const hours = hoursMatch ? `${hoursMatch[1]} hr ` : "";
  const minutes = minutesMatch ? `${minutesMatch[1]} min` : "";

  return `${hours}${minutes}`.trim();
}

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [userAttributes, setUserAttributes] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState({});
  const [confirmationCode, setConfirmationCode] = useState('');
  const [distancesByAirline, setDistancesByAirline] = useState({});

  const updateUserAttr = async () => {
    const res = await updateUserAttributes({
      userAttributes: {
        name: userAttributes.name,
        email: userAttributes.email,
        phone_number: userAttributes.phone_number,
        address: userAttributes.address,
        "custom:apartment_number": userAttributes["custom:apartment_number"],
        "custom:city": userAttributes["custom:city"],
        "custom:state": userAttributes["custom:state"],
        "custom:zip_code": userAttributes["custom:zip_code"]
      },
    });
    setUpdatedStatus(res)
    console.log(userAttributes, res)
  }

  const handleProfileChange = async () => {
    if (isChanging) {
      await updateUserAttr();
    }
    setIsChanging(!isChanging);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await confirmUserAttribute({
        userAttributeKey: 'email',
        confirmationCode: confirmationCode,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error confirming attribute:", error);
    }
  };
  console.log(userAttributes)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = await getCurrentUser();
        const userId = user.signInDetails.loginId;

        const response = await axios.get(`https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/user-bookings?userId=${userId}`);
        setBookings(response.data);

        const flights = response.data.flatMap(booking =>
          JSON.parse(booking.flightDetails).flatMap((offer) =>
            offer.itineraries.flatMap((itinerary) =>
              itinerary.segments.map((segment) => ({
                from: segment.departure.iataCode,
                to: segment.arrival.iataCode,
                airline: segment.carrierCode,
                departureTime: segment.departure.at,
                arrivalTime: segment.arrival.at,
                duration: segment.duration,
              }))
            )
          )
        );

        const distancesByAirlines = {};

        await Promise.all(
          flights.map(async (flight) => {
            const options = {
              method: 'POST',
              url: 'https://airportgap.com/api/airports/distance',
              headers: { 'content-type': 'application/json' },
              data: { from: flight.from, to: flight.to },
            };

            try {
              const { data } = await axios.request(options);
              const miles = Math.round(data.data.attributes.miles);
              const airline = flight.airline;

              if (distancesByAirlines[airline]) {
                distancesByAirlines[airline] += miles;
              } else {
                distancesByAirlines[airline] = miles;
              }
            } catch (error) {
              console.error(`Error calculating distance for flight from ${flight.from} to ${flight.to}:`, error);
            }
          })
        );

        setDistancesByAirline(distancesByAirlines);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      const attr = await fetchUserAttributes();
      setUserAttributes(attr);
    };

    fetchAttributes();
  }, []);

  return (
    <div>
      <div>
        <div className='profile-header'>
          <h2>Profile</h2>
          {isChanging ? (
            <button className="change-btn" onClick={handleProfileChange}>Save</button>
          ) : (
            <div className="change-btn" onClick={handleProfileChange}>Change</div>
          )}
        </div>
        <section>
          <div>
            <label htmlFor="full_name">Full name:</label>
            {
              userAttributes.name || isChanging ?
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
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          <div>
            <label htmlFor="phone_number">Phone:</label>
            {
              userAttributes.phone_number || isChanging ?
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
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="user-input"
              value={userAttributes.email || ''}
              disabled={!isChanging}
              onChange={(e) => setUserAttributes((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="address">Address or street name:</label>
            {
              userAttributes.address || isChanging ?
                <input
                  type="text"
                  id="address"
                  placeholder="Enter your full name"
                  className='user-input'
                  defaultValue={userAttributes.address}
                  disabled={!isChanging} //if is changing do not disable
                  onChange={(e) => setUserAttributes((prev) => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          <div>
            <label htmlFor="apartment_number">Apartment #:</label>
            {
              userAttributes["custom:apartment_number"] || isChanging ?
                <input
                  type="text"
                  id="apartment_number"
                  placeholder="Enter your full name"
                  className='user-input'
                  defaultValue={userAttributes["custom:apartment_number"]}
                  disabled={!isChanging} //if is changing do not disable
                  onChange={(e) => setUserAttributes((prev) => ({
                    ...prev,
                    "custom:apartment_number": e.target.value
                  }))}
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          <div>
            <label htmlFor="city">City:</label>
            {
              userAttributes["custom:city"] || isChanging ?
                <input
                  type="text"
                  id="city"
                  placeholder="Enter your full name"
                  className='user-input'
                  defaultValue={userAttributes["custom:city"]}
                  disabled={!isChanging} //if is changing do not disable
                  onChange={(e) => setUserAttributes((prev) => ({
                    ...prev,
                    "custom:city": e.target.value
                  }))}
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          <div>
            <label htmlFor="state">State:</label>
            {
              userAttributes["custom:state"] || isChanging ?
                <input
                  type="text"
                  id="state"
                  placeholder="Enter your full name"
                  className='user-input'
                  defaultValue={userAttributes["custom:state"]}
                  disabled={!isChanging} //if is changing do not disable
                  onChange={(e) => setUserAttributes((prev) => ({
                    ...prev,
                    "custom:state": e.target.value
                  }))}
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          <div>
            <label htmlFor="zip_code">Zip code:</label>
            {
              userAttributes["custom:zip_code"] || isChanging ?
                <input
                  type="text"
                  id="zip_code"
                  placeholder="Enter your full name"
                  className='user-input'
                  defaultValue={userAttributes["custom:zip_code"]}
                  disabled={!isChanging} //if is changing do not disable
                  onChange={(e) => setUserAttributes((prev) => ({
                    ...prev,
                    "custom:zip_code": e.target.value
                  }))}
                  required
                />
                :
                <div>N/A</div>
            }
          </div>

          {/* Email Confirmation */}
          {updatedStatus.email?.nextStep?.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE" && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="confirmationCode">Confirmation code:</label>
              <input
                type="text"
                id="confirmationCode"
                className="user-input"
                placeholder="Enter confirmation code"
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          )}
        </section>
      </div>

      <section>
        <h2>Loyalty Program</h2>
        {Object.keys(distancesByAirline).length > 0 ? (
          <div className="loyalty-box">
            {Object.entries(distancesByAirline).map(([airline, miles]) => (
              <div key={airline} className="loyalty-card">
                <img src={airlines.find(a => a.id === airline).logo} alt={`${airline} logo`} />
                <div>
                  <div className="title">{airlines.find(a => a.id === airline).name}</div>
                  <div>{miles} miles earned</div>
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
              <h4>Booking ID: {booking.bookingId}</h4>
              {JSON.parse(booking.flightDetails).map((offer, index) => (
                <div key={index}>
                  <h4>Flight {index + 1}</h4>
                  {offer.itineraries.map((itinerary, i) => (
                    <div key={i}>
                      <h5>Itinerary {i + 1}</h5>
                      {itinerary.segments.map((segment, j) => (
                        <div key={j}>
                          <div className='airline-iternary'>
                            <img src={airlines.find(a => a.id === segment.carrierCode).logo} alt={`${segment.carrierCode} logo`} />
                            <div>
                              <p className='title'>Airline: {airlines.find(a => a.id === segment.carrierCode)?.name || segment.carrierCode}</p>
                              <p>Duration: {formatDuration(segment.duration)}</p>
                            </div>
                          </div>
                          <p>From: {segment.departure.iataCode} ({segment.departure.at})</p>
                          <p>To: {segment.arrival.iataCode} ({segment.arrival.at})</p>

                          <hr />
                        </div>
                      ))}
                      <hr />
                    </div>
                  ))}
                </div>
              ))}
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
