import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightsList from "./views/FlightsList";
import Login from "./views/Login";
import Register from "./views/Register";
import UserProfile from "./views/UserProfile";
import Checkout from "./views/Checkout";
import FlightDetails from "./views/FlightDetails";
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function scrollToFlightDetails() {
  // Scrolls to the beginning of the Flight Details section
  const flightDetailsSection = document.getElementById('flight-details-section');
  flightDetailsSection.scrollIntoView({ behavior: 'smooth' });
}

function App() {
  useEffect(() => {
    console.log("App component is rendering");
  }, []);

  return (
    <Router> {/* Router component for routing */}
      <div className="container">
        {/* Bootstrap navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">SIFT</Link>
          <div className="collapse navbar-collapse">
            {/* Navbar links */}
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">Flights</Link>
              </li>
              <li className="navbar-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
              <li className="navbar-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li className="navbar-item">
                <Link to="/checkout" className="nav-link">Checkout</Link>
              </li>
              <li className="navbar-item">
                <Link to="/flight-details" className="nav-link" onClick={scrollToFlightDetails}>
                  Flight Details
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <Routes> {/* Define routes */}
          <Route path="/" element={<FlightsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/flight-details" element={<FlightDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
