import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import Flights from '../components/Flights';
import moment from 'moment';


class FlightsList extends Component {
  constructor(props) {
    super(props);

    // Initialize state with an empty array for flights
    this.state = { flights: [] };
  }

  componentDidMount() {
    this.fetchFlights();
  }

  fetchFlights() {
    axios.get('https://jqec36p0ji.execute-api.us-east-2.amazonaws.com/dev/flights')
      .then(response => {
        const formattedFlights = response.data.map(flight => {
          return flight;
        });
        this.setState({ flights: formattedFlights });
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
      });
  }

  handleSearch = (searchParams, sortBy) => { // Receive sortBy parameter
    axios.post('https://jqec36p0ji.execute-api.us-east-2.amazonaws.com/dev/flights/search', searchParams)
      .then(response => {
        let sortedFlights = response.data.sort((a, b) => a.price - b.price); // Sort by price in ascending order
        sortedFlights = sortedFlights.slice(0, 3); // Get top 3 flights with lowest prices
        this.setState({ flights: sortedFlights });
      })
      .catch(error => {
        console.error('Error searching flights:', error);
      });
  };

  handleFilter = (sortBy) => {
    axios.post('http://localhost:3000/flights/filter', { sortBy })
      .then(response => {
        this.setState({ flights: response.data });
      })
      .catch(error => {
        console.error('Error filtering flights:', error);
      });
  };

  formatDate(unixTimestamp) {
    // Use moment to convert UNIX timestamp
    return moment.unix(unixTimestamp).format('MM/DD/YYYY');
  }

  flightList() {
    return this.state.flights.map(currentFlight => {
      return <Flights flight={currentFlight} key={currentFlight._id} />;
    });
  }

  render() {
    return (
      <div>
        <h3>Flight List</h3>
        <SearchBar handleSearch={this.handleSearch} handleFilter={this.handleFilter} />
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Airline</th>
              <th>From</th>
              <th>To</th>
              <th>Departure Date</th>
              <th>Return Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.flights.map((flight, index) => (
                <Flights flight={flight} key={index} />
            ))}

          </tbody>
        </table>
      </div>
    );
  }
}

export default FlightsList;
