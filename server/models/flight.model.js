const mongoose = require('mongoose')

// Import Schema class from mongoose
const Schema = mongoose.Schema;

// Defining the flight schema
const flightSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true }, // Unique identifier for the flight
    airline: { 
        name: { type: String, required: true },
        iataCode: { type: String, required: true }
    },
    sourceAirport: { 
        name: { type: String, required: true },
        iataCode: { type: String, required: true }
    },
    destinationAirport: { 
        name: { type: String, required: true },
        iataCode: { type: String, required: true }
    },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
// Creating a model named "Flights" based on the flightSchema, associated with the "routes" collection
const Flights = mongoose.model('Flights', flightSchema, 'flights');

// Export the Flights model
module.exports = Flights;

/*
// MongoDB "sample_training.routes" database schema

{"_id":{"$oid":"56e9b39b732b6122f877fa31"},
"airline":{
    "id":{"$numberInt":"410"},
    "name":"Aerocondor",
    "alias":"2B",
    "iata":"ARD" },
"src_airport":"CEK",
"dst_airport":"KZN",
"codeshare":"",
"stops":{"$numberInt":"0"},
"airplane":"CR2"}
*/