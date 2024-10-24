import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/searchBar.css';

const SearchBar = ({ handleSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [leaveDate, setLeaveDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [oneWay, setOneWay] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchParams = {
      from,
      to,
      departureDate: leaveDate ? leaveDate.toISOString().split('T')[0] : '',
      returnDate: !oneWay && returnDate ? returnDate.toISOString().split('T')[0] : '',
      passengers,
      oneWay,
    };
    handleSearch(searchParams);
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <div className="search-section">
        <label>From:</label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Enter origin"
          required
        />
      </div>
      <div className="search-section">
        <label>To:</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Enter destination"
          required
        />
      </div>
      <div className="search-section">
        <label>Leave Date:</label>
        <DatePicker
          selected={leaveDate}
          onChange={(date) => setLeaveDate(date)}
          dateFormat="yyyy-MM-dd"
          required
        />
      </div>
      {!oneWay && (
        <div className="search-section">
          <label>Return Date:</label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
      )}
      <div className="search-section">
        <label>Passengers:</label>
        <input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
          min="1"
          required
        />
      </div>

      <button type="submit" className="search-button">Search</button>
      
      {/* Separate Container for One Way Checkbox */}
      <div className="one-way-container">
        <label>
          <input
            type="checkbox"
            checked={oneWay}
            onChange={() => setOneWay(!oneWay)}
          />
          <span>One Way</span>
        </label>
      </div>

    </form>
  );
};

export default SearchBar;