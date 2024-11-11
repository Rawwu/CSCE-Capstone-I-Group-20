import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/booking.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, selectedSeats, passengers = 1 } = location.state || {};
  const [travelerInfo, setTravelerInfo] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (!flight || !flight.price || !flight.itineraries || !flight.travelerPricings) {
    console.error("Incomplete flight data:", flight);
    return <div className="error-message">Error: Flight details are incomplete or not available.</div>;
  }

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTravelerInfo = [...travelerInfo];
    updatedTravelerInfo[index][name] = value;
    setTravelerInfo(updatedTravelerInfo);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const userId = travelerInfo[0].email;
        const travelers = travelerInfo.map((info, index) => ({
            id: (index + 1).toString(),
            dateOfBirth: info.dateOfBirth,
            name: { firstName: info.firstName, lastName: info.lastName },
            gender: info.gender,
            contact: {
                emailAddress: info.email,
                phones: [{ deviceType: "MOBILE", countryCallingCode: "1", number: info.phoneNumber }],
            },
            documents: [{ 
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
            }]
        }));

        // First, create the order and get bookingId
        const createOrderResponse = await axios.post(
            'https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/create-order',
            { flightOffer: flight, travelers, userId }
        );

        const { bookingId } = createOrderResponse.data;
        localStorage.setItem('email', userId);
        localStorage.setItem('bookingId', bookingId);
        if (!bookingId) {
            throw new Error("No bookingId returned from create order response.");
        }

        // Now, create the checkout session with bookingId
        const createSessionResponse = await axios.post(
            'https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/create-checkout-session',
            {
                flight: flight,
                quantity: 1,
                userId: userId,
                bookingId: bookingId, // Pass the bookingId to CreateCheckoutSession
            }
        );

        const { sessionId } = createSessionResponse.data;

        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            console.error("Stripe checkout error:", error);
        }
    } catch (error) {
        console.error('Error processing booking:', error);
    } finally {
        setLoading(false);
    }
};

  

  const renderPriceBreakdown = () => {
    const { travelerPricings, price } = flight;
    const breakdown = [];

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
                ))}
            </ul>
          )}
        </div>
      );
    });

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
      
      <h3>Price Breakdown:</h3>
      {renderPriceBreakdown()}

      <h3>Selected Seats:</h3>
      {selectedSeats && Object.keys(selectedSeats).map((key, index) => (
        <p key={index}>Seat {selectedSeats[key].number} on Segment {key}</p>
      ))}

      <p className="booking-details">Total Price: ${flight.price.grandTotal} USD</p>
      
      <form onSubmit={handleBookingSubmit}>
        {travelerInfo.map((info, index) => (
          <div key={index}>
            <h4>Passenger {index + 1}</h4>
            <label>First Name:
              <input type="text" name="firstName" value={info.firstName} onChange={(e) => handleInputChange(index, e)} required />
            </label>
            <label>Last Name:
              <input type="text" name="lastName" value={info.lastName} onChange={(e) => handleInputChange(index, e)} required />
            </label>
            <label>Email:
              <input type="email" name="email" value={info.email} onChange={(e) => handleInputChange(index, e)} required />
            </label>
            <label>Phone Number:
              <input type="text" name="phoneNumber" value={info.phoneNumber} onChange={(e) => handleInputChange(index, e)} required />
            </label>
            <label>Date of Birth:
              <input type="date" name="dateOfBirth" value={info.dateOfBirth} onChange={(e) => handleInputChange(index, e)} required />
            </label>
            <label>Gender:
              <select name="gender" value={info.gender} onChange={(e) => handleInputChange(index, e)}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
          </div>
        ))}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;