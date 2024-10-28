import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FlightsList from './FlightsList';
import Filters from '../components/Filters'; 
import { useNavigate, useLocation } from 'react-router-dom';

const SearchFlights = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { flights: previousFlights, passengers: previousPassengers } = location.state || {}; 
    const [flights, setFlights] = useState(previousFlights || []);
    const [passengers, setPassengers] = useState(previousPassengers || 1); 
    const [filters, setFilters] = useState({ directOnly: false, maxDuration: 24, sortBy: 'cheapest' });
    const [showFilters, setShowFilters] = useState(false); // New state variable to control filter visibility

    const handleSearch = async (searchParams) => {
        setLoading(true);
        setError(null);
        
        try {
            const url = `https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/search-flights`;
            const params = {
                origin: searchParams.from,
                destination: searchParams.to,
                departureDate: searchParams.departureDate,
                adults: searchParams.passengers,
                oneWay: searchParams.oneWay ? true : undefined,
            };
    
            // Only include returnDate if it's not a one-way trip
            if (!searchParams.oneWay && searchParams.returnDate) {
                params.returnDate = searchParams.returnDate;
            }
    
            const response = await axios.get(url, { params });
            const sortedFlights = response.data.sort((a, b) => a.price - b.price);
            setFlights(sortedFlights.slice(0, 10));
            setPassengers(searchParams.passengers);
            setShowFilters(true);
    
        } catch (err) {
            console.error('Error searching flights:', err);
            setError("Failed to fetch flight data.");
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleSelectFlight = (selectedFlight) => {
        setPassengers((prevPassengers) => {
            navigate('/flight-details', { 
                state: { 
                    flight: selectedFlight, 
                    passengerCount: prevPassengers,
                    previousFlights: flights 
                }
            });
            return prevPassengers;
        });
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const applyFilters = (flightList) => {
        let filteredFlights = flightList;
        
        if (filters.directOnly) {
            filteredFlights = filteredFlights.filter(flight => 
                flight.itineraries.every(itinerary => itinerary.segments.length === 1)
            );
        }

        filteredFlights = filteredFlights.filter(flight => {
            const totalDuration = flight.itineraries.reduce((acc, itinerary) => {
                const departureTime = new Date(itinerary.segments[0].departure.at);
                const arrivalTime = new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at);
                const duration = (arrivalTime - departureTime) / (1000 * 60 * 60);
                return acc + duration;
            }, 0);
            return totalDuration <= filters.maxDuration;
        });

        if (filters.sortBy === 'cheapest') {
            filteredFlights.sort((a, b) => a.price.grandTotal - b.price.grandTotal);
        } else if (filters.sortBy === 'fastest') {
            filteredFlights.sort((a, b) => {
                const durationA = a.itineraries.reduce((acc, itinerary) => {
                    const departureTime = new Date(itinerary.segments[0].departure.at);
                    const arrivalTime = new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at);
                    return acc + (arrivalTime - departureTime);
                }, 0);
                
                const durationB = b.itineraries.reduce((acc, itinerary) => {
                    const departureTime = new Date(itinerary.segments[0].departure.at);
                    const arrivalTime = new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at);
                    return acc + (arrivalTime - departureTime);
                }, 0);
                
                return durationA - durationB;
            });
        }

        return filteredFlights;
    };

    return (
        <div className="search-flights-container">
            <div className="search-header">
                <img src="/images/SIFT-Logo-Text-Only.png" alt="SIFT" style={{ height: '50px' }} />
                <SearchBar handleSearch={handleSearch} />
            </div>
            <div className="filters-and-results">
                {showFilters && <Filters onFilterChange={handleFilterChange} />}
                <div className="flights-list-container">
                    {loading && <p>Loading flights...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {flights.length > 0 && <FlightsList flights={applyFilters(flights)} handleSelect={handleSelectFlight} />}
                </div>
            </div>
        </div>
    );
};

export default SearchFlights;