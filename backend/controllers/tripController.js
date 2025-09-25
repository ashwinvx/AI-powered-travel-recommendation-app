const Trip = require('../models/Trip');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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