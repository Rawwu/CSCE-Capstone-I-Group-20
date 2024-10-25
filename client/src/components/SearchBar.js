import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API requests
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
  
  // New state variables for autocomplete
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // New state for IATA code
  const [fromIataCode, setFromIataCode] = useState('');
  const [toIataCode, setToIataCode] = useState('');

  // Debounce timeout variable
  let debounceTimeout;

  // Fetch suggestions based on input
  const fetchSuggestions = async (keyword, setSuggestions) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    debounceTimeout = setTimeout(async () => {
      try {
        const response = await axios.get('https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/autocomplete', {
          params: { keyword },
        });
        setSuggestions(response.data.data); // Assuming response contains "data"
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    }, 300); // 300ms debounce
  };

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFrom(value);
    if (value.length > 1) {
      fetchSuggestions(value, setFromSuggestions);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    if (value.length > 1) {
      fetchSuggestions(value, setToSuggestions);
    } else {
      setToSuggestions([]);
    }
  };

    const handleFromSelect = (suggestion) => {
        setFrom(`${suggestion.name} (${suggestion.iataCode})`);
        setFromIataCode(suggestion.iataCode); // Save only the IATA code
        setFromSuggestions([]);
    };

    const handleToSelect = (suggestion) => {
        setTo(`${suggestion.name} (${suggestion.iataCode})`);
        setToIataCode(suggestion.iataCode); // Save only the IATA code
        setToSuggestions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        const searchParams = {
            from: fromIataCode, // Use only the IATA code
            to: toIataCode, // Use only the IATA code
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
          onChange={handleFromChange}
          placeholder="Enter origin"
          required
        />
        {fromSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {fromSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleFromSelect(suggestion)}>
                {suggestion.name} ({suggestion.iataCode})
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="search-section">
        <label>To:</label>
        <input
          type="text"
          value={to}
          onChange={handleToChange}
          placeholder="Enter destination"
          required
        />
        {toSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {toSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleToSelect(suggestion)}>
                {suggestion.name} ({suggestion.iataCode})
              </li>
            ))}
          </ul>
        )}
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