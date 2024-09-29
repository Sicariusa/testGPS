import React from 'react';

function DriverInfo({ info, eta }) {
  if (!info) return null;

  return (
    <div className="driver-info">
      <h2>Driver Information</h2>
      <p>Name: {info.name}</p>
      <p>Vehicle: {info.vehicle}</p>
      {eta && <p>ETA: {eta.toUser} minutes to user, {eta.toDestination} minutes to destination</p>}
    </div>
  );
}

export default DriverInfo;