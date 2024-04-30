import React, { Component } from 'react';
import './FlightStatusPage.css'; // Import CSS file for styling

export default class FlightStatusPage extends Component {
  constructor(props) {
    super(props);

   // Mock flight ticket data
this.state = {
  flightTickets: [
    {
      bookingDate: "Saturday, December 3, 2022",
      guestName: "Stephanie Linden",
      route: "New York to London",
      from: "New York",
      to: "London",
      airline: "ACME Airlines",
      departureDate: "Tuesday, December 6, 2022 06:30",
      arrivalDate: "Tuesday, December 20, 2022 23:30",
      flightNumber: "AA7755",
      departureTerminal: "Terminal 1",
      arrivalTerminal: "Terminal 5",
      seatClass: "Business Class",
      extraBaggageAllowance: "2",
      seatNumber: "3-A"
    },
    {
      bookingDate: "Monday, March 14, 2023",
      guestName: "Steve Jobs",
      route: "Los Angeles to Tokyo",
      from: "Los Angeles",
      to: "Tokyo",
      airline: "Pacific Airways",
      departureDate: "Wednesday, March 16, 2022 09:45",
      arrivalDate: "Thursday, March 17, 2022 14:30",
      flightNumber: "BA2310",
      departureTerminal: "Terminal 3",
      arrivalTerminal: "Terminal 2",
      seatClass: "First Class",
      extraBaggageAllowance: "5",
      seatNumber: "3-F"
    }
  ],
  userInput: {
    flightNumber: "",
    lastName: ""
  },
  errorMessage: "",
  showFlightDetails: false // Flag to control displaying flight details or error message
};

  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      userInput: {
        ...prevState.userInput,
        [name]: value
      }
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { flightTickets, userInput } = this.state;
    const enteredFlightNumber = userInput.flightNumber.toLowerCase();
    const enteredLastName = userInput.lastName.toLowerCase();
  
    // Check each flight ticket for a match
    const matchedFlightTicket = flightTickets.find(ticket => {
      const storedFlightNumber = ticket.flightNumber.toLowerCase();
      const storedLastName = ticket.guestName.split(" ")[1].toLowerCase();
      return storedFlightNumber === enteredFlightNumber && storedLastName === enteredLastName;
    });
  
    if (matchedFlightTicket) {
      // Input matches, proceed to show flight details
      this.setState({ errorMessage: "", flightTicket: matchedFlightTicket, showFlightDetails: true });
    } else {
      // Input doesn't match any flight ticket, show error message
      this.setState({ errorMessage: "Flight number or last name is incorrect. Please try again.", showFlightDetails: false });
    }
  }
  
  

  render() {
    const { flightTicket, userInput, errorMessage, showFlightDetails } = this.state;

    return (
      <div>
        {!showFlightDetails && (
          <div>
            <h3>Enter Flight Details</h3>
            <form onSubmit={this.handleSubmit}>
              <div>
                <label>Flight Number:</label>
                <input type="text" name="flightNumber" value={userInput.flightNumber} onChange={this.handleInputChange} />
              </div>
              <div>
                <label>Last Name:</label>
                <input type="text" name="lastName" value={userInput.lastName} onChange={this.handleInputChange} />
              </div>
              <button type="submit">Submit</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
          </div>
        )}
        {showFlightDetails && (
          <>
            <h3>Flight Ticket Information</h3>
            <table className="flight-info-table">
              <tbody>
                <tr>
                  <td><strong>Booking Date:</strong></td>
                  <td>{flightTicket.bookingDate}</td>
                </tr>
                <tr>
                  <td><strong>Guest Name:</strong></td>
                  <td>{flightTicket.guestName}</td>
                </tr>
              </tbody>
            </table>
            {/* Horizontal line */}
            <hr className="divider" />
            <table className="flight-info-table">
              <tbody>
                <tr>
                  <td><strong>Flight Details:</strong></td>
                  <td>
                    <table>
                      <tbody>
                        <tr><td><strong>Route:</strong></td><td>{flightTicket.route}</td></tr>
                        <tr><td><strong>From:</strong></td><td>{flightTicket.from}</td></tr>
                        <tr><td><strong>To:</strong></td><td>{flightTicket.to}</td></tr>
                        <tr><td><strong>Airline:</strong></td><td>{flightTicket.airline}</td></tr>
                        <tr><td><strong>Departure Date:</strong></td><td>{flightTicket.departureDate}</td></tr>
                        <tr><td><strong>Arrival Date:</strong></td><td>{flightTicket.arrivalDate}</td></tr>
                        <tr><td><strong>Flight Number:</strong></td><td>{flightTicket.flightNumber}</td></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Horizontal line */}
            <hr className="divider" />
            <table className="flight-info-table">
              <tbody>
                <tr>
                  <td><strong>Terminal & Seat Information:</strong></td>
                  <td>
                    <table>
                      <tbody>
                        <tr><td><strong>Departure Terminal:</strong></td><td>{flightTicket.departureTerminal}</td></tr>
                        <tr><td><strong>Arrival Terminal:</strong></td><td>{flightTicket.arrivalTerminal}</td></tr>
                        <tr><td><strong>Seat Class:</strong></td><td>{flightTicket.seatClass}</td></tr>
                        <tr><td><strong>Extra Baggage Allowance:</strong></td><td>{flightTicket.extraBaggageAllowance}</td></tr>
                        <tr><td><strong>Seat Number:</strong></td><td>{flightTicket.seatNumber}</td></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}
