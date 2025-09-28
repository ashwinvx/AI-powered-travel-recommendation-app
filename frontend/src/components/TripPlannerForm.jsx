import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './TripPlannerForm.css';

const TripPlannerForm = () => {
    const navigate = useNavigate(); // Get the navigate function
    const [formData, setFormData] = useState({
        destination: '',
        dates: '',
        budget: '',
        travelStyle: '',
    });

    // Use state to handle loading and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.destination || !formData.dates || !formData.budget || !formData.travelStyle) {
            setError('Please fill out all fields.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/trips/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server responded with an error:', response.status, errorText);
                throw new Error(errorText || 'Failed to generate trip.');
            }

            const data = await response.json();

            setSuccessMessage('Trip generated and saved successfully!');
            setFormData({
                destination: '',
                dates: '',
                budget: '',
                travelStyle: '',
            });

            // Redirect to the new trip's detail page using its ID
            if (data.trip && data.trip._id) {
                navigate(`/trip/${data.trip._id}`); //
            }

        } catch (err) {
            setError(err.message);
            console.error('Submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Generate Your Trip Itinerary</h2>
            <form onSubmit={ handleSubmit }>
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
                        placeholder="e.g., October 20-25, 2025"
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
                        placeholder="e.g., adventure, relaxing, culture"
                    />
                </div>

                <button type="submit" disabled={ loading }>
                    { loading ? 'Generating...' : 'Generate Trip' }
                </button>
            </form>

            { error && <div className="message error-message">{ error }</div> }
            { successMessage && <div className="message success-message">{ successMessage }</div> }
        </div>
    );
};

export default TripPlannerForm;
