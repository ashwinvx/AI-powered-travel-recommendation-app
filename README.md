# AI-Powered Travel Planner Application

## Project Overview

This project outlines an AI-powered travel application designed to streamline trip planning and provide personalized destination recommendations. Leveraging a robust MERN stack and integrating various external APIs, the application offers a comprehensive platform for users to generate, manage, and share their travel itineraries [page 1].

## Features

*   **Trip Generation:** Users can effortlessly create multi-day itineraries by providing their destination, travel dates, budget, and preferred travel style (e.g., "adventure," "relaxing," "foodie") [page 1].
*   **Destination Recommendations:** The AI intelligently suggests potential destinations based on user input and preferences, such as "warm places in winter" or "budget-friendly European cities" [page 1].
*   **Personalization:** The application learns from user feedback, saved trips, and stored preferences in MongoDB to deliver increasingly tailored recommendations over time [page 1].
*   **Interactive Map:** Visualize your generated itinerary on an interactive map, enabling the discovery of nearby points of interest like restaurants and attractions [page 1].
*   **User Management:** Users have the flexibility to save, edit, and share their personalized travel plans within the application [page 1].

## Technology Stack

The application is built upon the **MERN Stack**, providing a powerful and scalable foundation:

*   **MongoDB:** Utilized for storing diverse data, including user profiles, preferences, saved trips, past search queries, and the comprehensive AI-generated itinerary data [page 1].
*   **Express.js (Node.js):** Forms the backend framework, handling API endpoints, user requests, external API communication, AI response processing, and managing user authentication [page 1].
*   **React:** Powers the dynamic and interactive front-end user interface, facilitating seamless input of travel preferences, display of itineraries, and interactive map visualizations [page 1].

## APIs Used

To deliver a rich and comprehensive travel planning experience, the application integrates with several free external APIs:

*   **Google Gemini API:** Employed for generative AI capabilities, allowing the creation of detailed, text-based itineraries based on user prompts (e.g., "Create a 5-day itinerary for a foodie trip to Rome with a mid-range budget. Include flight and hotel recommendations") [page 2].
*   **Google Maps API:** Integrates map functionalities, enabling users to explore nearby locations (restaurants, attractions) via the Places API and visualize their itinerary on a map [page 2].
*   **OpenWeatherMap API:** Enhances itineraries by fetching real-time weather data for specified travel dates and destinations, providing valuable contextual information [page 2].
*   **Kayak or Skyscanner API:** (Note: Free tiers are often limited) Used to showcase flight and hotel recommendations, making server-side requests through the Express backend [page 2].
```<ctrl95>
