import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Flights from '../components/Flights';


export default class FlightsList extends Component {
  constructor(props) {
    super(props);


    this.state = { flights: [] };
  }


  componentDidMount() {
    axios.get('http://localhost:3001/flights/')
      .then(response => {
        this.setState({ flights: response.data });
      })
      .catch((error) => {
        console.log(error);
      })
  }


  flightList() {
    return this.state.flights.map(currentFlight => {
      return <Flights flight={currentFlight} key={currentFlight._id} />;
    })
  }


  render() {
    return (
      <div>
        <h3>Flight List</h3>
        <div className="search-box">
          <input type="text" placeholder="Search for flight" />
          <button>Search</button>
        </div>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Source Airport</th>
              <th>Destination Airport</th>
            </tr>
          </thead>
          <tbody>
            { this.flightList() }
          </tbody>
        </table>
      </div>
    )
  }
}