import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,NavLink, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import SearchFlights from './views/SearchFlights';
import Login from "./views/Login";
import Register from "./views/Register";
import UserProfile from "./views/UserProfile";
import FlightDetails from "./views/FlightDetails";
import Booking from "./views/Booking";
import BookingConfirmation from "./views/BookingConfirmation";
import FindBooking from './views/FindBooking';
import BookingDetails from './views/BookingDetails';
import ForgotPassword from './views/ForgotPassword';
import ConfirmResetPassword from './views/ConfirmResetPW';
import FlightPricePredictor from './views/FlightPricePredictor';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import "./App.css"

function scrollToFlightDetails() {
    const flightDetailsSection = document.getElementById('flight-details-section');
    flightDetailsSection.scrollIntoView({ behavior: 'smooth' });
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open,setIsOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

    return (
        <div className=" main-wrapper">
        <nav className="navbar navbar-expand-lg px-4 w-[100%] navbar-light bg-light">
        <Link to="/" className="navbar-brand">
            <img src="/images/SIFT-Logo-No-Text.png" alt="SIFT Logo" style={{ height: '60px', marginRight: '10px' }} />
        </Link>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li  role='menuitem' className="navbar-item">
                <NavLink to="/" className="nav-link">Flights</NavLink>
              </li>
              <li  role='menuitem' className="navbar-item">
                <NavLink to="/price-predictor" className={({isActive}) => `nav-link ${isActive ? "active": ""}`}>Price Predictor</NavLink>
              </li>
              {!isAuthenticated ? (
                <>
                  <li  role='menuitem' className="navbar-item">
                    <NavLink to="/login" className="nav-link">Login</NavLink>
                  </li>
                  <li  role='menuitem' className="navbar-item">
                    <NavLink to="/register" className="nav-link">Register</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li  role='menuitem' className="navbar-item">
                    <NavLink to="/profile" className="nav-link">Profile</NavLink>
                  </li>
                  <li  role='menuitem' className="navbar-item">
                    <button className="nav-link btn btn-link" onClick={handleSignOut}>Sign Out</button>
                  </li>
                </>
              )}
              <li  role='menuitem' className="navbar-item">
                <Link to="/find-booking" className="nav-link booking-btn">Find Booking</Link>
              </li>
            </ul>
          </div>
          <button
          className="menu-btn"
          onClick={() => setIsOpen(true)} 
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>

        
  <div className={`mobile-nav ${open ? 'open' : ''}`}>
         <button
            // className="close-btn"
            className='close-menu'
            onClick={() => setIsOpen(false)} 
            aria-label="Close menu"
          >
            <span className="sr-only">Close menu</span>
          </button>
   <ul>
     <li  role='menuitem'>
     <Link to="/" className="nav-link">Flights</Link>
     </li>
     <li  role='menuitem'>
     <Link to="/price-predictor" className="nav-link">Price Predictor</Link>
     </li>
     {!isAuthenticated ? (
     <>
       <li  role='menuitem' className="navbar-item">
         <Link to="/login" className="nav-link">Login</Link>
       </li>
       <li  role='menuitem' className="navbar-item">
         <Link to="/register" className="nav-link">Register</Link>
       </li>
     </>
   ) : (
     <>
       <li  role='menuitem' className="navbar-item">
         <Link to="/profile" className="nav-link">Profile</Link>
       </li>
       <li  role='menuitem' className="navbar-item">
         <button className="nav-link btn btn-link" onClick={handleSignOut}>Sign Out</button>
       </li>
     </>
   )}
     <li  role='menuitem' className="navbar-item">
     <Link to="/find-booking" className="nav-link booking-btn">Find Booking</Link>
   </li>
   </ul>
</div>         
        </nav>
        <br />
            <Routes>
                <Route path="/" element={<SearchFlights  />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/flight-details" element={<FlightDetails />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/confirmation" element={<BookingConfirmation />} />
                <Route path="/find-booking" element={<FindBooking />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/confirm-reset-password" element={<ConfirmResetPassword />} />
                <Route path="/price-predictor" element={<FlightPricePredictor />} />
            </Routes>
        </div>
    );
}

export default App;