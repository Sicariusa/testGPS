import React from 'react';

function DriverInfo({ info }) {
  if (!info) return null;

  return (
    <div className="driver-info">
      <h2>Driver Information</h2>
      <p>Name: {info.name}</p>
      <p>Vehicle: {info.vehicle}</p>
      <p>ETA: {info.eta}</p>
    </div>
  );
}

export default DriverInfo;