const Trip = require('../models/Trip');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios'); // Import axios

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// POST request to generate a trip itinerary
module.exports.generatetrips_post = async (req, res) => {
  try {
    // Extract user preferences from the request body
    const { destination, dates, budget, travelStyle } = req.body;

    if (!destination || !dates || !budget || !travelStyle) {
      return res.status(400).json({ message: 'Missing required travel parameters.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct a detailed prompt for the AI
    const prompt = `
            Create a detailed trip itinerary in JSON format.
            - **Destination**: ${destination}
            - **Dates**: ${dates}
            - **Budget**: ${budget}
            - **Travel Style**: ${travelStyle}
            - **Output Format**: A JSON object with a single "itinerary" key.
            The "itinerary" key should be an array of daily objects, each with a "day" (number), "date" (string), and "activities" (array of strings).
            Each activity string should be a concise description.
            Include basic flight and accommodation recommendations if possible.

            Example JSON format:
            {
              "itinerary": [
                {
                  "day": 1,
                  "date": "...",
                  "activities": ["Check into hotel", "Explore city center", "Dinner at local restaurant"]
                }
              ],
              "recommendations": {
                "flights": "...",
                "accommodation": "..."
              }
            }
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Regular expression to remove "```json" from the start and "```" from the end
    const cleanedText = text.replace(/^```json\n|```$/g, '');

    // Attempt to parse the AI-generated text as JSON
    const aiOutput = JSON.parse(cleanedText);

    const newTrip = new Trip({
      destination,
      dates,
      budget,
      travelStyle,
      ...aiOutput // Spreads the itinerary and recommendations
    });

    await newTrip.save();

    res.status(200).json({
      message: 'Trip generated and saved successfully',
      trip: newTrip
    });

  } catch (error) {
    console.error('Error generating trip:', error);

    // Send a generic error message and the raw AI response for debugging
    res.status(500).json({
      message: 'Failed to generate trip. Please try again.',
      error: error.message
    });
  }
}

// GET request to retrieve all saved trips
module.exports.allsavedtrips_get = async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 }); // Fetch all trips, sorted by creation date
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      message: 'Failed to retrieve trips. Please try again.',
      error: error.message
    });
  }
}

// GET request to retrieve a single trip by its ID
module.exports.tripid_get = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching single trip:', error);
    res.status(500).json({
      message: 'Failed to retrieve trip. Please try again.',
      error: error.message
    });
  }
}

// PATCH request to update a trip with AI-generated itinerary
module.exports.tripid_aiupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { destination, dates, budget, travelStyle } = req.body;

    if (!destination || !dates || !budget || !travelStyle) {
      return res.status(400).json({ message: 'Missing required travel parameters.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Retrieve the current trip to inform the AI
    const existingTrip = await Trip.findById(id);
    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Construct a new prompt for the AI to update the trip
    const prompt = `
        Update the trip itinerary in JSON format based on the following changes.
        - **Current Trip Details**: ${JSON.stringify(existingTrip)}
        - **New Destination**: ${destination}
        - **New Dates**: ${dates}
        - **New Budget**: ${budget}
        - **New Travel Style**: ${travelStyle}
        - **Output Format**: Return a JSON object with a single "itinerary" key.
        The "itinerary" key should be an array of daily objects, each with a "day" (number), "date" (string), and "activities" (array of strings).
        Each activity string should be a concise description.
        Include basic flight and accommodation recommendations if possible, referencing the new criteria.
        
        Example JSON format:
        {
          "itinerary": [
            {
              "day": 1,
              "date": "...",
              "activities": ["Check into hotel", "Explore city center", "Dinner at local restaurant"]
            }
          ],
          "recommendations": {
            "flights": "...",
            "accommodation": "..."
          }
        }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/^```json\n|```$/g, '');
    const aiOutput = JSON.parse(cleanedText);

    // Merge the AI's output with the updated user preferences
    const updatedData = {
      destination,
      dates,
      budget,
      travelStyle,
      ...aiOutput
    };

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Trip updated with new AI-generated itinerary.',
      trip: updatedTrip
    });

  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({
      message: 'Failed to update trip. Please try again.',
      error: error.message
    });
  }
}

// PATCH request to manually update trip details and itinerary
module.exports.tripid_update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      req.body, // The entire updated trip object comes from the client
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    res.status(200).json({
      message: 'Trip manually updated successfully.',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Error manually updating trip:', error);
    res.status(500).json({
      message: 'Failed to manually update trip. Please try again.',
      error: error.message
    });
  }
}

// GET request to retrieve a single trip and its coordinates
module.exports.tripidmapdata_get = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const mapData = {
      center: { lat: 0, lng: 0 },
      markers: [],
    };
    const geocodingPromises = [];

    // Geocode each activity in the itinerary
    trip.itinerary.forEach(dayPlan => {
      dayPlan.activities.forEach(activity => {
        const query = `${activity}, ${trip.destination}`;
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${process.env.GOOGLE_GEOCODING_API_KEY}`;

        // Add logging to see which API call is being made
        console.log('Geocoding URL:', geocodeUrl);

        geocodingPromises.push(
          axios.get(geocodeUrl)
            .then(response => {
              if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;
                mapData.markers.push({
                  lat: location.lat,
                  lng: location.lng,
                  title: activity,
                });
              } else {
                // Log API call status if not OK
                console.error('Geocoding API status not OK:', response.data.status, response.data.error_message);
              }
            })
            .catch(error => {
              // Log any errors from the Geocoding API request
              console.error('Error in Geocoding API call:', error.message);
            })
        );
      });
    });

    await Promise.all(geocodingPromises);

    // Calculate the center of the map based on the markers
    if (mapData.markers.length > 0) {
      const avgLat = mapData.markers.reduce((sum, m) => sum + m.lat, 0) / mapData.markers.length;
      const avgLng = mapData.markers.reduce((sum, m) => sum + m.lng, 0) / mapData.markers.length;
      mapData.center = { lat: avgLat, lng: avgLng };
    } else {
      // Fallback: Geocode the destination city as the center
      const destResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trip.destination)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
      if (destResponse.data.status === 'OK') {
        mapData.center = destResponse.data.results[0].geometry.location;
      }
    }

    res.status(200).json(mapData);

  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({
      message: 'Failed to retrieve map data. Please try again.',
      error: error.message
    });
  }
}
