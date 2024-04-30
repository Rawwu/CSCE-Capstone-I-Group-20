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
    axios.get('http://localhost:3000/flights/')
      .then(response => {
        const formattedFlights = response.data.map(flight => {
          // Format departureDate and returnDate before updating state
          const formattedDepartureDate = this.formatDate(flight.departureDate);
          const formattedReturnDate = this.formatDate(flight.returnDate);
          return { ...flight, departureDate: formattedDepartureDate, returnDate: formattedReturnDate };
        });
        this.setState({ flights: formattedFlights });
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
      });
  }

  handleSearch = (searchParams, sortBy) => { // Receive sortBy parameter
    axios.post('http://localhost:3000/flights/search', searchParams)
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

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  flightList() {
    return this.state.flights.map(currentFlight => {
        // Format departureDate and returnDate before passing them to Flights component
        const formattedDepartureDate = moment(currentFlight.departureDate).tz('America/Chicago').format('MM/DD [at] hh:mm A');
        const formattedReturnDate = moment(currentFlight.returnDate).tz('America/Chicago').format('MM/DD [at] hh:mm A');
        console.log('Formatted Departure Date:', formattedDepartureDate);
        console.log('Formatted Return Date:', formattedReturnDate);
        return <Flights flight={{ ...currentFlight, departureDate: formattedDepartureDate, returnDate: formattedReturnDate }} key={currentFlight._id} />;
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