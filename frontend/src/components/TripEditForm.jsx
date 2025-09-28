import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripPlannerForm.css';

const TripEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        destination: '',
        dates: '',
        budget: '',
        travelStyle: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(`/api/trips/${id}`);
                if (!response.ok) {
                    throw new Error('Trip not found.');
                }
                const data = await response.json();
                setFormData({
                    destination: data.destination,
                    dates: data.dates,
                    budget: data.budget,
                    travelStyle: data.travelStyle,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission with AI call
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            // Change the fetch endpoint to the new /edit/:id route
            const response = await fetch(`/api/trips/edit/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update trip.');
            }

            setMessage('Trip updated successfully with a new AI itinerary!');
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

    if (error && !message) {
        return <div className="details-message error">{ error }</div>;
    }

    return (
        <div className="form-container">
            <h2>Edit Trip to { formData.destination }</h2>
            <form onSubmit={ handleSubmit }>
                {/* ... (input fields remain the same) ... */ }
                <div className="form-group">
                    <label htmlFor="destination">Destination:</label>
                    <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={ formData.destination }
                        onChange={ handleChange }
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dates">Dates:</label>
                    <input
                        type="text"
                        id="dates"
                        name="dates"
                        value={ formData.dates }
                        onChange={ handleChange }
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="budget">Budget:</label>
                    <select
                        id="budget"
                        name="budget"
                        value={ formData.budget }
                        onChange={ handleChange }
                        required
                    >
                        <option value="">Select a budget...</option>
                        <option value="Budget-friendly">Budget-friendly</option>
                        <option value="Mid-range">Mid-range</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="travelStyle">Travel Style:</label>
                    <input
                        type="text"
                        id="travelStyle"
                        name="travelStyle"
                        value={ formData.travelStyle }
                        onChange={ handleChange }
                        required
                    />
                </div>

                <button type="submit" disabled={ loading }>
                    { loading ? 'Generating...' : 'Update with AI' }
                </button>
            </form>

            { message && <div className="message success-message">{ message }</div> }
            { error && <div className="message error-message">{ error }</div> }
        </div>
    );
};

export default TripEditForm;
