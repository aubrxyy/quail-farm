interface RouteResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  coordinates: [number, number][]; // [lng, lat] format
}

export async function calculateOpenRoute(
  farmLat: number, 
  farmLng: number, 
  customerLat: number, 
  customerLng: number
): Promise<RouteResult | null> {
  try {
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: {
        'Authorization': process.env.OPENROUTE_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates: [[farmLng, farmLat], [customerLng, customerLat]],
        format: 'json'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.summary.distance / 1000, // Convert meters to km
        duration: route.summary.duration / 60,   // Convert seconds to minutes
        coordinates: route.geometry.coordinates  // [lng, lat] format
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
}

// Fallback to direct distance if API fails
export function calculateDirectDistance(
  farmLat: number, 
  farmLng: number, 
  customerLat: number, 
  customerLng: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (customerLat - farmLat) * Math.PI / 180;
  const dLng = (customerLng - farmLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(farmLat * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}