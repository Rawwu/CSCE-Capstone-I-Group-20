import React from 'react'
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightsList from "./views/FlightsList";
import Login from "./views/Login";
import Register from "./views/Register";
import UserProfile from "./views/UserProfile";
import Checkout from "./views/Checkout";

function App() {
  return (
    <Router> {/* Router component for routing */}
      <div className="container">
        {/* Bootstrap navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">SIFT</Link>
          <div className="collpase navbar-collapse">
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
            </ul>
          </div>
        </nav>
        <br/>
        <Routes> {/* Define routes */}
          <Route path="/" element={<FlightsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

// Export App component as default
export default App;