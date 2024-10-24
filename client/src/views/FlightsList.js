import React, { Component } from 'react';
import Flights from '../components/Flights';

class FlightsList extends Component {
  constructor(props) {
    super(props);
    this.state = { flights: [], loading: false, error: null };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.flights !== this.props.flights) {
      this.setState({ flights: this.props.flights });
    }
  }

  render() {
    return (
      <div>
        <h3>Flight List</h3>
        {this.state.loading && <p>Loading flights...</p>}
        {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
        <table className="table">
        <tbody>
            {this.props.flights.map((flight, index) => (
                <Flights flight={flight} key={index} handleSelect={this.props.handleSelect} />
            ))}
        </tbody>
        </table>
      </div>
    );
  }
}

export default FlightsList;
