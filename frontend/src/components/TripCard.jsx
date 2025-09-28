import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './TripCard.css';

const TripCard = ({ trip }) => {
    return (
        <div className="trip-card">
            <h3>{ trip.destination }</h3>
            <p className="card-subtitle">{ trip.dates }</p>
            <p><strong>Budget:</strong> { trip.budget }</p>
            <p><strong>Travel Style:</strong> { trip.travelStyle }</p>
            <div className="itinerary-summary">
                <h4>Itinerary Highlights:</h4>
                <ul>
                    { trip.itinerary?.slice(0, 2).map((dayPlan, index) => (
                        <li key={ index }>{ dayPlan.activities[0] }...</li>
                    )) }
                </ul>
            </div>
            <Link to={ `/trip/${trip._id}` } className="view-details-btn">
                View Details
            </Link>
        </div>
    );
};

export default TripCard;
