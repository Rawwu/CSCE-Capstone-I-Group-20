import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FlightsList from './FlightsList';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchFlights = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { flights: previousFlights } = location.state || {}; // Get previous flights from state
    const [flights, setFlights] = useState(previousFlights || []); // Use previous flights if available

    const handleSearch = async (searchParams) => {
        setLoading(true);
        setError(null);
      
        try {
            const url = `https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/search-flights`;
            const params = {
                origin: searchParams.from,
                destination: searchParams.to,
                departureDate: searchParams.departureDate,
                returnDate: searchParams.returnDate,
                adults: searchParams.passengers,
            };

            const response = await axios.get(url, { params });
            const sortedFlights = response.data.sort((a, b) => a.price - b.price);
            setFlights(sortedFlights.slice(0, 10));
        } catch (err) {
            console.error('Error searching flights:', err);
            setError("Failed to fetch flight data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFlight = (selectedFlight) => {
        // Navigate to flight details page with the selected flight and current search results
        navigate('/flight-details', { state: { flight: selectedFlight, previousFlights: flights } });
    };    

    return (
        <div>
            <h1>Search Flights</h1>
            <SearchBar handleSearch={handleSearch} />
            {loading && <p>Loading flights...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {flights.length > 0 && <FlightsList flights={flights} handleSelect={handleSelectFlight} />}
        </div>
    );
};

export default SearchFlights;
