export async function calculateETA(origin, destination) {
  try {
    const response = await fetch('/api/calculate-eta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
    });
    const data = await response.json();
    return data.eta;
  } catch (error) {
    console.error('Error calculating ETA:', error);
    return null;
  }
}
