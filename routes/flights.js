const router = require('express').Router()
let Flights = require('../models/flight.model');


router.route('/').get((req, res) => {
    Flights.find()
    .then(examples => res.json(examples))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req, res) => {
    const airline = req.body.airline;
    const src_airport = req.body.src_airport;
    const dst_airport = req.body.dst_airport;
    const codeshare = req.body.codeshare;
    const stops = req.body.stops;
    const airplane = req.body.airplane;
  
    const newFlight = new Flights({
      airline,
      src_airport,
      dst_airport,
      codeshare,
      stops,
      airplane,
    });
  
    newFlight.save()
      .then(() => res.json('Flight added!'))
      .catch(err => res.status(400).json('Error: ' + err));
  });


module.exports = router;

;