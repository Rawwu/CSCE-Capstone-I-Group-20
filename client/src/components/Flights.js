import React from 'react';
import { useNavigate } from 'react-router-dom';
import airlineLogos from '../assets/airlineLogos';
import '../styles/flightCard.css';

const Flights = ({ flight, handleSelect }) => {
  const { itineraries, price, validatingAirlineCodes } = flight;
  const airlineLogo = airlineLogos[validatingAirlineCodes[0]] || '/images/logos/default.png';
  const navigate = useNavigate();

  // Helper function to format time and date
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Helper function to calculate total flight duration
  const calculateTotalDuration = (departure, arrival) => {
    const durationMs = new Date(arrival) - new Date(departure);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hr ${minutes} min`;
  };

  // Departure flight info
  const departureSegment = itineraries[0].segments;
  const departureTime = formatDateTime(departureSegment[0].departure.at);
  const finalDepartureSegment = departureSegment[departureSegment.length - 1];
  const arrivalTime = formatDateTime(finalDepartureSegment.arrival.at);
  const totalDuration = calculateTotalDuration(departureSegment[0].departure.at, finalDepartureSegment.arrival.at);
  const layoverLocation = departureSegment.length > 1 ? departureSegment[0].arrival.iataCode : 'Direct';

  // Return flight info (if available)
  const returnSegment = itineraries[1]?.segments || [];
  const returnDepartureTime = returnSegment.length ? formatDateTime(returnSegment[0].departure.at) : null;
  const finalReturnSegment = returnSegment.length ? returnSegment[returnSegment.length - 1] : null;
  const returnArrivalTime = finalReturnSegment ? formatDateTime(finalReturnSegment.arrival.at) : null;
  const returnDuration = finalReturnSegment ? calculateTotalDuration(returnSegment[0].departure.at, finalReturnSegment.arrival.at) : null;
  const returnLayoverLocation = returnSegment.length > 1 ? returnSegment[0].arrival.iataCode : 'Direct';

  const onSelectFlight = () => {
    handleSelect(flight); // Call the passed function from props
  };

  return (
    <div className="card my-3 shadow-sm rounded border-0">
      <div className="card-body d-flex justify-content-between align-items-center">
        {/* Departure Flight Info */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center">
            <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo me-3" />
            <span>{departureTime} <strong>→</strong> {arrivalTime}</span>
            <span className="ms-3">{totalDuration}</span>
            <span className="ms-3">{departureSegment.length - 1} stop{departureSegment.length > 2 ? 's' : ''} ({layoverLocation})</span>
          </div>
          <div className="d-flex align-items-center small mt-1">
            <span>{departureSegment[0].departure.iataCode}</span>
            <span className="mx-2"><strong>→</strong></span>
            <span>{finalDepartureSegment.arrival.iataCode}</span>
          </div>
        </div>

        {/* Price and Select Button */}
        <div className="text-center d-flex flex-column align-items-center">
          <h4 className="text-primary mb-2">${price.grandTotal}</h4>
          <button className="btn btn-primary mt-auto" onClick={onSelectFlight}>Select</button>
        </div>
      </div>

      {/* Return Flight */}
      {returnSegment.length > 0 && (
        <div className="card-body d-flex justify-content-between align-items-center mt-2">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <img src={airlineLogo} alt={validatingAirlineCodes[0]} className="airline-logo me-3" />
              <span>{returnDepartureTime} <strong>→</strong> {returnArrivalTime}</span>
              <span className="ms-3">{returnDuration}</span>
              <span className="ms-3">{returnSegment.length - 1} stop{returnSegment.length > 2 ? 's' : ''} ({returnLayoverLocation})</span>
            </div>
            <div className="d-flex align-items-center small mt-1">
              <span>{returnSegment[0].departure.iataCode}</span>
              <span className="mx-2"><strong>→</strong></span>
              <span>{finalReturnSegment.arrival.iataCode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;