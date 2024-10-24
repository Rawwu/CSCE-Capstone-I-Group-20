import React, { useState } from 'react';
import '../styles/filters.css';

const Filters = ({ onFilterChange }) => {
  const [directOnly, setDirectOnly] = useState(false);
  const [maxDuration, setMaxDuration] = useState(24); // Default max of 24 hours
  const [sortBy, setSortBy] = useState('cheapest');

  const handleDirectChange = (e) => {
    setDirectOnly(e.target.checked);
    onFilterChange({ directOnly: e.target.checked, maxDuration, sortBy });
  };

  const handleDurationChange = (e) => {
    setMaxDuration(e.target.value);
    onFilterChange({ directOnly, maxDuration: e.target.value, sortBy });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onFilterChange({ directOnly, maxDuration, sortBy: e.target.value });
  };

  return (
    <div className="filters-container">
      <h4>Filters</h4>
      
      <div className="filter-option">
        <input 
          type="checkbox" 
          checked={directOnly} 
          onChange={handleDirectChange} 
        />
        <label>Direct flights only</label>
      </div>

      <div className="filter-option">
        <label>Maximum Trip Duration (hrs):</label>
        <input 
          type="range" 
          min="1" 
          max="24" 
          value={maxDuration} 
          onChange={handleDurationChange} 
        />
        <span>{maxDuration} hrs</span>
      </div>

      <div className="filter-option">
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="cheapest">Cheapest First</option>
          <option value="fastest">Fastest First</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;