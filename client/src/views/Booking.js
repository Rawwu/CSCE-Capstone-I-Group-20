import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state || {};

  // Traveler information state
  const [travelerInfo, setTravelerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'MALE'  // Default value, changeable based on form
  });

  // Check if flight data exists before trying to access properties
  if (!flight || !flight.price) {
    return <div>Error: Flight details not available.</div>;
  }

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setTravelerInfo({ ...travelerInfo, [name]: value });
	};

	const handleBookingSubmit = async (e) => {
		e.preventDefault();
		try {
			// Create traveler object following Amadeus API requirements
			const travelers = [
			{
				id: "1",
				dateOfBirth: travelerInfo.dateOfBirth,
				name: {
				firstName: travelerInfo.firstName,
				lastName: travelerInfo.lastName
				},
				gender: travelerInfo.gender,
				contact: {
				emailAddress: travelerInfo.email,
				phones: [
					{
					deviceType: "MOBILE",
					countryCallingCode: "1", // Default to US country code, update as needed
					number: travelerInfo.phoneNumber
					}
				]
				}
			}
			];

			// Log the data before sending it to the API
			console.log("Flight offer data being sent:", flight);
			console.log("Traveler data being sent:", travelers);

			const response = await axios.post('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/create-order', {
				data: {
					type: "flight-order",
					flightOffers: [flight],  // Ensure flight offer is in an array
					travelers: travelers      // Include traveler data
				}
			});

			console.log("Payload being sent to Amadeus API:", {
				data: {
					type: "flight-order",
					flightOffers: [flight],
					travelers: travelers
				}
			});
			  

			console.log('Booking response:', response.data);
			navigate('/confirmation', { state: { booking: response.data } }); // Redirect to confirmation page
			} catch (error) {
			console.error('Error creating booking:', error);
			}
	};
  



  return (
    <div>
      <h1>Booking Details</h1>
      <p>Total Price: ${flight.price.grandTotal}</p>

      <form onSubmit={handleBookingSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={travelerInfo.firstName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={travelerInfo.lastName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={travelerInfo.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={travelerInfo.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dateOfBirth"
            value={travelerInfo.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={travelerInfo.gender}
            onChange={handleInputChange}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </label>
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingPage;