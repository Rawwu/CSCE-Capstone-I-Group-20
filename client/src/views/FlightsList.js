import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Flights from '../components/Flights';


export default class FlightsList extends Component {
  constructor(props) {
    super(props);

    // Initialize state with an empty array for flights
    this.state = { flights: [] };
  }

  componentDidMount() {
    // Make HTTP GET request to fetch flights data from the server
    axios.get('http://localhost:3000/flights/')
      .then(response => {
        // Update state with the fetched flights data
        this.setState({ flights: response.data });
      })
      .catch((error) => {
        // Log any errors to the console
        console.log(error);
      })
  }

  flightList() { // Map through the flights data in state and return a Flights component for each flight
    return this.state.flights.map(currentFlight => {
      return <Flights flight={currentFlight} key={currentFlight._id} />;
    })
  }

  render() {
    return (
      <div>
        <h3>Flight List</h3>
        <div className="search-box">
        {/* Input field for search */}
          <input type="text" placeholder="Search for flight" />
          <button>Search</button>
        </div>
        {/* Table for displaying flights */}
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Source Airport</th>
              <th>Destination Airport</th>
            </tr>
          </thead>
          <tbody>
            { this.flightList() } {/* Render flight list */}
          </tbody>
        </table>
      </div>
    )
  }
}