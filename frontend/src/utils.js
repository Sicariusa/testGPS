export function calculateETA(origin, destination) {
  // This is a simplified calculation and doesn't account for roads or traffic
  const R = 6371; // Earth's radius in km
  const dLat = (destination[1] - origin[1]) * Math.PI / 180;
  const dLon = (destination[0] - origin[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin[1] * Math.PI / 180) * Math.cos(destination[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  // Assume average speed of 30 km/h
  const timeInHours = distance / 30;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  return timeInMinutes;
}
