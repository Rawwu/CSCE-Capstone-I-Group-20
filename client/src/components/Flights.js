import React from 'react'


const Flights = props => (
  <div>
    <h3>{props.flight.name}</h3>
    <p>{props.flight.description}</p>
    <p>{props.flight.date.substring(0,10)}</p>
  </div>
);


export default Flights;