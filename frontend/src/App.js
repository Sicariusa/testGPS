import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserPage from './components/UserPage';
import DriverPage from './components/DriverPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/user">User View</Link></li>
            <li><Link to="/driver">Driver View</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path="/driver" element={<DriverPage />} />
          <Route path="/" element={
            <>
              <h1>Welcome to Driver Tracking App</h1>
              <p>Choose User or Driver view from the navigation above.</p>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
