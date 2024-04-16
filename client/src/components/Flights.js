import React from 'react'

// Functional component named Flights with a destructured prop flight
const Flights = ({ flight }) => {
	// Destructure flight object to extract airline, source airport, and destination airport
	const { airline, src_airport, dst_airport } = flight;

	// Return a table row with data from flight object
	return (
	<tr>
		<td>{airline.name}</td>
		<td>{src_airport}</td>
		<td>{dst_airport}</td>
	</tr>
	);
};

// Export Flights component
export default Flights;