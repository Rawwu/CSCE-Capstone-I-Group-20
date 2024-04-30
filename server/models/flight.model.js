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