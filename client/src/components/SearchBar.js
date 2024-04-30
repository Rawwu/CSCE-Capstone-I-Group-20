import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/searchBar.css';

const SearchBar = ({ handleSearch  }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [leaveDate, setLeaveDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [sortByPrice, setSortByPrice] = useState(''); // State for sorting by price

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format dates to ISODate format
    const formattedSearchParams = {
      from,
      to,
      departureDate: leaveDate.toISOString(),
      returnDate: returnDate.toISOString(),
      passengers
    };
    // Pass the search parameters to the handleSearch function
    handleSearch(formattedSearchParams, 'asc'); // Always sort by ascending price on search
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <div className="search-section">
        <label>From:</label>
        <input placeholder='DFW' type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="search-section">
        <label>To:</label>
        <input placeholder='LAX' type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="search-section">
        <label>Leave Date:</label>
        <DatePicker selected={leaveDate} onChange={date => setLeaveDate(date)} />
      </div>
      <div className="search-section">
        <label>Return Date:</label>
        <DatePicker selected={returnDate} onChange={date => setReturnDate(date)} />
      </div>
      <div className="search-section">
        <label>Passengers:</label>
        <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} />
      </div>
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default SearchBar;