const mongoose = require('mongoose')


const Schema = mongoose.Schema;

const flightSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    airline: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      alias: { type: String, required: true },
      iata: { type: String, required: true }
    },
    src_airport: { type: String, required: true },
    dst_airport: { type: String, required: true },
    codeshare: { type: String, required: false },
    stops: { type: Number, required: true },
    airplane: { type: String, required: true }
  }, {
    timestamps: true,
  });

const Flights = mongoose.model('Flights', flightSchema, 'routes');



module.exports = Flights;

/*
// MongoDB file schema
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