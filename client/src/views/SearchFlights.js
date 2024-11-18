import React, { useState } from 'react';
import axios from 'axios';
import '../styles/searchFlights.css';
import SearchBar from '../components/SearchBar';
import FlightsList from './FlightsList';
import Filters from '../components/Filters'; 
import { useNavigate, useLocation } from 'react-router-dom';

const SearchFlights = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showIntro, setShowIntro] = useState(true); // New state to control intro visibility
    const location = useLocation();
    const navigate = useNavigate();
    const { flights: previousFlights, passengers: previousPassengers } = location.state || {}; 
    const [flights, setFlights] = useState(previousFlights || []);
    const [passengers, setPassengers] = useState(previousPassengers || 1); 
    const [filters, setFilters] = useState({ directOnly: false, maxDuration: 48, sortBy: 'cheapest' });
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = async (searchParams) => {
        setLoading(true);
        setError(null);
        setShowIntro(false); // Hide intro section once the search is initiated

        try {
            const url = `https://y2zghqn948.execute-api.us-east-2.amazonaws.com/Dev/search-flights`;
            const params = {
                origin: searchParams.from,
                destination: searchParams.to,
                departureDate: searchParams.departureDate,
                adults: searchParams.passengers,
                oneWay: searchParams.oneWay ? true : undefined,
            };
    
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
    
    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handlePredictorClick = () => {
        navigate('/price-predictor');
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

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Searching for flights...</p>
                </div>
            )}

            {!loading && (
                <>             
                {/* Filter Section */}
                <div className="filters-and-results">
                    {showFilters && <Filters onFilterChange={handleFilterChange} />}
                    <div className="flights-list-container">
                        {loading && <p>Loading flights...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {flights.length > 0 && <FlightsList flights={applyFilters(flights)} handleSelect={handleSelectFlight} />}
                    </div>
                </div>
                </>
            )}

            {/* Introductory Section */}
            {showIntro && (
                <div className="intro-section">
                    <div className="intro-text">
                        <h2>Find Best Valued Flights</h2>
                        <p>Discover the most affordable and convenient flights tailored to your travel needs. Sign up to unlock exclusive offers and start your journey with us.</p>
                        <button onClick={handleRegisterClick} className="register-button">Register Now</button>
                    </div>
                    <div className="intro-image">
                        <img src="/images/airport-outside.jpg" alt="Outside airport" />
                    </div>
                </div>
            )}

            {/* Flight Price Predictor Section */}
            {showIntro && (
            <div className="price-predictor-section">
                <div className="predictor-image">
                    <img src="/images/bot.jpg" alt="Price Predictor" />
                </div>
                <div className="predictor-content">
                    <h3>Flight Price Predictor</h3>
                    <p>
                        Enter your origin and destination to find the cheapest dates to fly! Our Flight Price Predictor analyzes fare trends to help you pick the best day to book.
                    </p>
                    <button onClick={handlePredictorClick} className="predictor-button">Explore Predictor</button>
                </div>
            </div>
            )}

            {/* Informative Section */}
            {showIntro && (
                <div className="info-section">
                    
                    <div className="info-content">
                        <h3>Why Choose Our Platform?</h3>
                        <p>With our advanced search technology, we bring you the best flight options available. Enjoy hassle-free booking, exclusive deals, and secure payment options. Your journey starts here!</p>
                    </div>
                </div>
            )}

            {/* Footer Section */}
            <footer className="footer">
                <p>&copy; 2024 SIFT Flights. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/facebook.webp" alt="Facebook" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/twitter.svg" alt="Twitter" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/instagram.webp" alt="Instagram" />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default SearchFlights;