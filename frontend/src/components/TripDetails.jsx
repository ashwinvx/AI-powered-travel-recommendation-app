import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'; // Import map components
import './TripDetails.css';

const TripDetails = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openInfoWindow, setOpenInfoWindow] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch trip details
                const tripResponse = await fetch(`/api/trips/${id}`);
                if (!tripResponse.ok) {
                    throw new Error('Trip not found or failed to fetch');
                }
                const tripData = await tripResponse.json();
                setTrip(tripData);

                // Fetch map data separately
                const mapResponse = await fetch(`/api/trips/${id}/map-data`);
                if (!mapResponse.ok) {
                    throw new Error('Failed to fetch map data');
                }
                const mapCoordinates = await mapResponse.json();
                setMapData(mapCoordinates);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="details-message">Loading trip details...</div>;
    }

    if (error) {
        return <div className="details-message error">{ error }</div>;
    }

    if (!trip) {
        return <div className="details-message error">Trip not found.</div>;
    }

    return (
        <div className="trip-details-container">
            <div className="details-actions">
                <button
                    className="edit-trip-btn"
                    onClick={ () => navigate(`/trip/edit/ai/${id}`) }
                >
                    Edit Trip with AI
                </button>
                <button
                    className="edit-trip-btn manual-edit-btn"
                    onClick={ () => navigate(`/trip/edit/manual/${id}`) }
                >
                    Manually Edit
                </button>
            </div>
            <h2>Trip to { trip.destination }</h2>
            <div className="details-header">
                <p><strong>Dates:</strong> { trip.dates }</p>
                <p><strong>Budget:</strong> { trip.budget }</p>
                <p><strong>Travel Style:</strong> { trip.travelStyle }</p>
            </div>
            <div className="itinerary-section">
                <h3>Itinerary</h3>
                { trip.itinerary && trip.itinerary.map((dayPlan, index) => (
                    <div key={ index } className="day-plan">
                        <h4>Day { dayPlan.day }: { dayPlan.date }</h4>
                        <ul>
                            { dayPlan.activities.map((activity, actIndex) => (
                                <li key={ actIndex }>{ activity }</li>
                            )) }
                        </ul>
                    </div>
                )) }
            </div>
            <div className="recommendations-section">
                <h3>Recommendations</h3>
                <p><strong>Flights:</strong> { trip.recommendations?.flights }</p>
                <p><strong>Accommodation:</strong> { trip.recommendations?.accommodation }</p>
            </div>
            {/* Map Visualization Section */ }
            { mapData && mapData.markers.length > 0 && (
                <div className="map-section">
                    <h3>Map Visualization</h3>
                    <div className="map-container">
                        <APIProvider apiKey={ import.meta.env.VITE_GOOGLE_MAPS_API_KEY }>
                            <Map
                                defaultCenter={ mapData.center }
                                defaultZoom={ 10 }
                                mapId="de8dccccd03828c48188d4b6" // A custom map ID
                            >
                                { mapData.markers.map((marker, index) => (
                                    <AdvancedMarker
                                        key={ index }
                                        position={ { lat: marker.lat, lng: marker.lng } }
                                        title={ marker.title }
                                        onClick={ () => setOpenInfoWindow(marker) }
                                    >
                                        {/* You can add custom content here if needed */ }
                                        <div style={ {
                                            color: '#fff',
                                            backgroundColor: '#58a6ff',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                        } }>{ index + 1 }</div>
                                    </AdvancedMarker>
                                )) }
                                {/* Render the InfoWindow if a marker is selected */ }
                                { openInfoWindow && (
                                    <InfoWindow
                                        position={ { lat: openInfoWindow.lat, lng: openInfoWindow.lng } }
                                        onCloseClick={ () => setOpenInfoWindow(null) }
                                    >
                                        <div>
                                            <h4>{ openInfoWindow.title }</h4>
                                        </div>
                                    </InfoWindow>
                                ) }
                            </Map>
                        </APIProvider>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default TripDetails;

