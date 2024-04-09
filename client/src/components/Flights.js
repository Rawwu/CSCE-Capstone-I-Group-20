import React from 'react'

const Flights = ({ flight }) => {
  const { airline, src_airport, dst_airport } = flight;

  return (
    <tr>
      <td>{airline.name}</td>
      <td>{src_airport}</td>
      <td>{dst_airport}</td>
    </tr>
  );
};

export default Flights;