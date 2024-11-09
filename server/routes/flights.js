const router = require('express').Router()
const Flights = require('../models/flight.model');
const moment = require('moment');
require('moment-timezone');

// Route to handle GET requests to retrieve flights data
router.route('/').get((req, res) => {
    // Parse the limit parameter from query string or default to 20
    const limit = parseInt(req.query.limit) || 20;
    Flights.find().limit(limit)
    .then(flights => res.json(flights)) // If successful, send JSON response with flights data
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route to handle POST requests for flight search
router.post('/search', (req, res) => {
    let { from, to, departureDate, returnDate } = req.body;

    // Capitalize the first letter of from and to IATA codes
    from = from.toUpperCase();
    to = to.toUpperCase();

    // Parse dates to ensure they are in the correct format
    const parsedDepartureDate = new Date(departureDate);
    const parsedReturnDate = new Date(returnDate);

    // Construct the search query based on the provided parameters
    const searchQuery = {
        'sourceAirport.iataCode': from,
        'destinationAirport.iataCode': to,
        'departureDate': { $gte: new Date(departureDate).setUTCHours(0, 0, 0, 0) },
        'returnDate': { $lte: new Date(returnDate).setUTCHours(23, 59, 59, 999) }
    };

    console.log('Constructed search query:', searchQuery);

    // Execute the search query
    Flights.find(searchQuery)
        .then(results => {
            // Format dates and other fields before sending response
            const formattedResults = results.map(result => ({
                _id: result._id,
                airline: result.airline,
                sourceAirport: result.sourceAirport,
                destinationAirport: result.destinationAirport,
                departureDate: moment(result.departureDate).tz('America/Chicago').format('MM/DD [at] hh:mm A'),
                returnDate: moment(result.returnDate).tz('America/Chicago').format('MM/DD [at] hh:mm A'),
                price: result.price,
                capacity: result.capacity,
                availableSeats: result.availableSeats
            }));
            res.json(formattedResults);
        })
        .catch(error => {
            console.error('Error searching flights:', error);
            res.status(500).json({ error: 'An error occurred while searching for flights' });
        });
});

router.post('/filter', (req, res) => {
    const { sortBy } = req.body; // Get the sorting parameter (e.g., 'price')
  
    // Define the sorting criteria based on the sortBy parameter
    let sortCriteria;
    if (sortBy === 'asc') {
      sortCriteria = { price: 1 }; // Sort by price, lowest to highest
    } else if (sortBy === 'desc') {
      sortCriteria = { price: -1 }; // Sort by price, highest to lowest
    }
  
    // Execute the query with the sorting criteria
    Flights.find().sort(sortCriteria)
      .then(results => {
        res.json(results);
      })
      .catch(error => {
        console.error('Error filtering flights:', error);
        res.status(500).json({ error: 'An error occurred while filtering flights' });
      });
  }); 

// Export the router module
module.exports = router;
