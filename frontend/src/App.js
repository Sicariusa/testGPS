import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserPage from './components/UserPage';
import DriverPage from './components/DriverPage';
import HomePage from './components/HomePage';
import './styles/global.css';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="logo">TrackMate</Link>
            <ul className="nav-links">
              <li><Link to="/user">User View</Link></li>
              <li><Link to="/driver">Driver View</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path="/driver" element={<DriverPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2023 TrackMate. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
