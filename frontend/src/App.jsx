import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TripPlannerForm from './components/TripPlannerForm';
import Dashboard from './components/Dashboard';
import TripDetails from './components/TripDetails';
import TripEditForm from './components/TripEditForm';
import TripManualEdit from './components/TripManualEdit';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>AI-Powered Trip Planner</h1>
          <nav>
            <Link to="/" className="nav-link">Plan a Trip</Link>
            <Link to="/dashboard" className="nav-link">View Trips</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={ <TripPlannerForm /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/trip/:id" element={ <TripDetails /> } />
            <Route path="/trip/edit/ai/:id" element={ <TripEditForm /> } />
            <Route path="/trip/edit/manual/:id" element={ <TripManualEdit /> } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
