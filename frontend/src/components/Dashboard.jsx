import { useState, useEffect } from 'react';
import TripCard from './TripCard.jsx';
import './Dashboard.css'; // For styling the dashboard grid

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch('/api/trips');
                if (!response.ok) {
                    throw new Error('Failed to fetch trips');
                }
                const data = await response.json();
                setTrips(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div className="dashboard-message">Loading your saved trips...</div>;
    }

    if (error) {
        return <div className="dashboard-message error">Error: { error }</div>;
    }

    if (trips.length === 0) {
        return <div className="dashboard-message">No trips saved yet. Generate one to get started!</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Your Saved Trips</h2>
            <div className="trips-grid">
                { trips.map((trip) => (
                    <TripCard key={ trip._id } trip={ trip } />
                )) }
            </div>
        </div>
    );
};

export default Dashboard;
