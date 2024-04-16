const router = require('express').Router()
let Flights = require('../models/flight.model');

// Route to handle GET requests to retrieve flights data
router.route('/').get((req, res) => {
    // Parse the limit parameter from query string or default to 20
    const limit = parseInt(req.query.limit) || 20;
    Flights.find().limit(limit)
    .then(flights => res.json(flights)) // If successful, send JSON response with flights data
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route to handle POST requests to add a new flight (NOT yet functional - no input box)
router.route('/add').post((req, res) => {
    // Extract flight details from request body
    const airline = req.body.airline;
    const src_airport = req.body.src_airport;
    const dst_airport = req.body.dst_airport;
    const codeshare = req.body.codeshare;
    const stops = req.body.stops;
    const airplane = req.body.airplane;
    
    // Create a new Flight object with extracted details
    const newFlight = new Flights({
      airline,
      src_airport,
      dst_airport,
      codeshare,
      stops,
      airplane,
    });
    // Save the new flight to the database
    newFlight.save()
      .then(() => res.json('Flight added!'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

// Export the router module
module.exports = router;