import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/booking.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, selectedSeats, passengers = 1 } = location.state || {};

  // Initialize travelerInfo state based on the number of passengers
  const [travelerInfo, setTravelerInfo] = useState([]);

  useEffect(() => {
    const initialTravelerInfo = Array.from({ length: passengers }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'MALE'
    }));
    setTravelerInfo(initialTravelerInfo);
  }, [passengers]);

  if (!flight || !flight.price) {
    return <div className="error-message">Error: Flight details not available.</div>;
  }

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTravelerInfo = [...travelerInfo];
    updatedTravelerInfo[index][name] = value;
    setTravelerInfo(updatedTravelerInfo);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const userId = travelerInfo[0].email; // Assuming the first traveler's email is the primary identifier

    try {
      const travelers = travelerInfo.map((info, index) => ({
        id: (index + 1).toString(),
        dateOfBirth: info.dateOfBirth,
        name: {
          firstName: info.firstName,
          lastName: info.lastName
        },
        gender: info.gender,
        contact: {
          emailAddress: info.email,
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "1",
              number: info.phoneNumber
            }
          ]
        },
        documents: [ // Hardcoded values for testing
          {
            documentType: "PASSPORT",
            birthPlace: "New York",
            issuanceLocation: "New York",
            issuanceDate: "2020-01-01",
            number: "123456789",
            expiryDate: "2030-01-01",
            issuanceCountry: "US",
            validityCountry: "US",
            nationality: "US",
            holder: true
          }
        ]
      }));

      const response = await axios.post('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/create-order', {
        userId,
        flightOffer: flight,
        travelers: travelers
      });

      navigate('/confirmation', { state: { booking: response.data } });
    } catch (error) {
      console.error('Booking no longer available.', error);
    }
  };

  const renderPriceBreakdown = () => {
    const { travelerPricings, price } = flight;
    const breakdown = [];

    if (travelerPricings) {
      travelerPricings.forEach((traveler, index) => {
        breakdown.push(
          <div key={index}>
            <p>Traveler {index + 1} ({traveler.travelerType}):</p>
            <p>Base Price: ${traveler.price.base} USD</p>
            {traveler.price.taxes && traveler.price.taxes.length > 0 && (
              <ul>
                {traveler.price.taxes
                  .filter(tax => tax.code === "US")
                  .map((tax, i) => (
                    <li key={i}>
                      Tax ({tax.code}): ${tax.amount} USD
                    </li>
                  ))
                }
              </ul>
            )}
          </div>
        );
      });
    }

    breakdown.push(
      <div key="grand-total">
        {price.fees && price.fees.length > 0 && (
          <ul>
            {price.fees.map((fee, i) => (
              <li key={i}>
                {fee.type.replace('_', ' ')} Fee: ${fee.amount} USD
              </li>
            ))}
          </ul>
        )}
        <p>Grand Total: ${price.grandTotal} USD</p>
      </div>
    );

    return breakdown;
  };

  return (
    <div className="booking-container">
      <h1 className="booking-title">Booking Details</h1>
      
      {/* Display price breakdown */}
      <h3>Price Breakdown:</h3>
      {renderPriceBreakdown()}

      {/* Display selected seats */}
      <h3>Selected Seats:</h3>
      {selectedSeats && Object.keys(selectedSeats).map((key, index) => (
        <p key={index}>Seat {selectedSeats[key].number} on Segment {key}</p>
      ))}

      <p className="booking-details">Total Price: ${flight.price.grandTotal} USD</p>
      
      <form onSubmit={handleBookingSubmit}>
        {travelerInfo.map((info, index) => (
          <div key={index}>
            <h4>Passenger {index + 1}</h4>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={info.firstName}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={info.lastName}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={info.email}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={info.phoneNumber}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dateOfBirth"
                value={info.dateOfBirth}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </label>
            <label>
              Gender:
              <select
                name="gender"
                value={info.gender}
                onChange={(e) => handleInputChange(index, e)}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
          </div>
        ))}
        <button type="submit" className="submit-button">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingPage;
