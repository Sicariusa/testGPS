import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/LocationSearch.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkbzAiLCJhIjoiY2x5dDF4MjkwMGRtMTJqb3Q3MG81dGJpeCJ9.LRT9kWKN_D5kHOdH4o6qbA';

function LocationSearch({ onLocationSelect, onCancelDestination }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (location) => {
    onLocationSelect({
      name: location.place_name,
      coordinates: location.center
    });
    setSearchQuery(location.place_name);
    setSuggestions([]);
  };

  return (
    <div className="location-search">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter a destination"
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => handleSelectLocation(suggestion)}>
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
      {searchQuery && (
        <button onClick={onCancelDestination} className="cancel-button">
          Cancel
        </button>
      )}
    </div>
  );
}

export default LocationSearch;