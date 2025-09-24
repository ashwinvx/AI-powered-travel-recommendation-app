Project features
Core functionality
Trip generation: Users provide a destination, travel dates, budget, and travel style (e.g., "adventure," "relaxing," "foodie"). The AI generates a multi-day itinerary.
Destination recommendations: The AI suggests potential destinations based on user input, like "warm places in winter" or "budget-friendly European cities."
Personalization: As a user uses the app, the recommendations become more tailored based on their feedback, saved trips, and preferences stored in the MongoDB database.
Interactive map: A map allows users to visualize their itinerary and find points of interest nearby.
User management: Users can save, edit, and share their generated trips. 

Technology stack and APIs
MERN Stack components
MongoDB: Stores user profiles, preferences, saved trips, past search queries, and AI-generated itinerary data.
Express.js (Node.js): Builds the backend API endpoints to handle user requests, communicate with external APIs, and process the AI-generated responses. It will also manage user authentication.
React: Provides the front-end user interface for inputting travel preferences, displaying the generated itinerary, and visualizing maps. 
Free external APIs
Generative AI API:
Google Gemini API: A prompt such as "Create a 5-day itinerary for a foodie trip to Rome with a mid-range budget. Include flight and hotel recommendations" can be used. The API will generate the initial text-based itinerary.
Supporting APIs:
Google Maps API: Incorporate map functionality, allow users to find nearby locations (restaurants, attractions) using the Places API, and enable map visualization of the itinerary.
OpenWeatherMap API: Enhance the itinerary by fetching weather data for the specified travel dates and destination, providing more comprehensive travel information.
Kayak or Skyscanner API: While free tiers are limited, they can be used to showcase flight and hotel data by making server-side requests through the Express backend. 
