import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripSubmission from './pages/TripSubmission';
import Insurance from './pages/Insurance';
import Claims from './pages/Claims';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
       <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip" element={<TripSubmission />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
