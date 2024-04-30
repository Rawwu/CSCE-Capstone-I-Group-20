import React from 'react'

// Functional component named Flights with a destructured prop flight
const Flights = ({ flight }) => {
	// Destructure flight object to extract airline, source airport, and destination airport
    const { airline, sourceAirport, destinationAirport, departureDate, returnDate, price } = flight;

    // Return a table row with data from flight object
    return (
        <tr>
            <td>{airline}</td>
            <td>{sourceAirport ? sourceAirport.iataCode : ''}</td>
            <td>{destinationAirport ? destinationAirport.iataCode : ''}</td>
            <td>{departureDate}</td>
            <td>{returnDate}</td>
            <td>${price}</td>
        </tr>
    );
};

// Export Flights component
export default Flights;