const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    date: { type: String, required: true },
    activities: { type: [String], required: true }
});

const recommendationsSchema = new mongoose.Schema({
    flights: String,
    accommodation: String
});

const tripSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    dates: { type: String, required: true },
    budget: { type: String, required: true },
    travelStyle: { type: String, required: true },
    itinerary: { type: [itineraryItemSchema], required: true },
    recommendations: recommendationsSchema,
    createdAt: { type: Date, default: Date.now }
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
