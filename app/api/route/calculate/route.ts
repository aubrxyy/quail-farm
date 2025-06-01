import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let farmLat: number = 0, farmLng: number = 0, customerLat: number = 0, customerLng: number = 0;
  try {
    ({ farmLat, farmLng, customerLat, customerLng } = await request.json());
    
    // Using OpenRouteService (free tier available)
    const API_KEY = process.env.OPENROUTE_API_KEY;
    
    if (!API_KEY) {
      console.log('OpenRouteService API key not configured, using fallback');
      return getFallbackRoute(farmLat, farmLng, customerLat, customerLng);
    }
    
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${farmLng},${farmLat}&end=${customerLng},${customerLat}`,
      {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        },
      }
    );
    
    if (!response.ok) {
      console.log('OpenRouteService API failed, using fallback');
      return getFallbackRoute(farmLat, farmLng, customerLat, customerLng);
    }
    
    const data = await response.json();
    const route = data.features[0];
    
    return NextResponse.json({
      distance: (route.properties.segments[0].distance / 1000), // Convert to km
      duration: (route.properties.segments[0].duration / 60), // Convert to minutes
      coordinates: route.geometry.coordinates // Already in [lng, lat] format
    });
    
  } catch (error) {
    console.error('Route calculation error:', error);
    return getFallbackRoute(farmLat, farmLng, customerLat, customerLng);
  }
}

// Helper function for fallback route with more realistic path
function getFallbackRoute(farmLat: number, farmLng: number, customerLat: number, customerLng: number) {
  // Calculate direct distance
  const R = 6371; // Earth's radius in km
  const dLat = (customerLat - farmLat) * Math.PI / 180;
  const dLng = (customerLng - farmLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(farmLat * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Generate more realistic route with intermediate points
  const coordinates: [number, number][] = [];
  const steps = 10; // Number of intermediate points
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    
    // Add some curve to simulate road routing
    const curveFactor = Math.sin(t * Math.PI) * 0.005; // Small curve
    const randomFactor = (Math.random() - 0.5) * 0.002; // Small random variation
    
    const lng = farmLng + (customerLng - farmLng) * t + curveFactor + randomFactor;
    const lat = farmLat + (customerLat - farmLat) * t + curveFactor * 0.5 + randomFactor;
    
    coordinates.push([lng, lat]);
  }
  
  return NextResponse.json({
    distance: distance * 1.2, // Add 20% for road routing vs direct distance
    duration: Math.round(distance * 2.5), // More realistic time estimate
    coordinates: coordinates
  });
}