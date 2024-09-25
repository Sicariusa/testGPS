import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="container">
        <h1>Welcome to TrackMate</h1>
        <p>Real-time driver tracking made easy</p>
        <div className="cta-buttons">
          <Link to="/user" className="btn btn-primary">Track a Driver</Link>
          <Link to="/driver" className="btn btn-secondary">I'm a Driver</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
