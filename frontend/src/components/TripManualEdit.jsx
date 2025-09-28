import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripManualEdit.css';

const TripManualEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Fetch existing trip data
    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(`/api/trips/${id}`);
                if (!response.ok) {
                    throw new Error('Trip not found.');
                }
                const data = await response.json();
                setTrip(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    // Handle itinerary item changes
    const handleItineraryChange = (dayIndex, activityIndex, value) => {
        const updatedTrip = { ...trip };
        updatedTrip.itinerary[dayIndex].activities[activityIndex] = value;
        setTrip(updatedTrip);
    };

    // Handle recommendations changes
    const handleRecommendationChange = (field, value) => {
        const updatedTrip = { ...trip };
        updatedTrip.recommendations[field] = value;
        setTrip(updatedTrip);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`/api/trips/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trip),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to manually update trip.');
            }

            setMessage('Trip updated successfully!');
            setTimeout(() => {
                navigate(`/trip/${id}`);
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="details-message">Loading trip data...</div>;
    }

    if (error) {
        return <div className="details-message error">{ error }</div>;
    }

    if (!trip) {
        return <div className="details-message">Trip not found.</div>;
    }

    return (
        <div className="manual-edit-container">
            <h2>Manually Edit Trip to { trip.destination }</h2>
            <form onSubmit={ handleSubmit }>
                <div className="section">
                    <h3>Itinerary</h3>
                    { trip.itinerary.map((dayPlan, dayIndex) => (
                        <div key={ dayIndex } className="day-edit-block">
                            <h4>Day { dayPlan.day }: { dayPlan.date }</h4>
                            { dayPlan.activities.map((activity, activityIndex) => (
                                <textarea
                                    key={ activityIndex }
                                    value={ activity }
                                    onChange={ (e) => handleItineraryChange(dayIndex, activityIndex, e.target.value) }
                                    rows="3"
                                />
                            )) }
                        </div>
                    )) }
                </div>

                <div className="section">
                    <h3>Recommendations</h3>
                    <div className="rec-group">
                        <label>Flights:</label>
                        <textarea
                            value={ trip.recommendations?.flights || '' }
                            onChange={ (e) => handleRecommendationChange('flights', e.target.value) }
                            rows="2"
                        />
                    </div>
                    <div className="rec-group">
                        <label>Accommodation:</label>
                        <textarea
                            value={ trip.recommendations?.accommodation || '' }
                            onChange={ (e) => handleRecommendationChange('accommodation', e.target.value) }
                            rows="2"
                        />
                    </div>
                </div>

                <button type="submit" disabled={ loading }>
                    { loading ? 'Saving...' : 'Save Manual Changes' }
                </button>
            </form>

            { message && <div className="message success-message">{ message }</div> }
            { error && <div className="message error-message">{ error }</div> }
        </div>
    );
};

export default TripManualEdit;
