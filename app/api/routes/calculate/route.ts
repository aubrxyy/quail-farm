import { NextResponse } from 'next/server';
import { DijkstraPathfinder } from '@/lib/dijkstra';

const pathfinder = new DijkstraPathfinder();

export async function POST(request: Request) {
  try {
    const { destinationLat, destinationLng, destinationName } = await request.json();

    if (!destinationLat || !destinationLng) {
      return NextResponse.json({ 
        error: 'Destination coordinates are required' 
      }, { status: 400 });
    }

    // Farm coordinates: 6°36'21.5"S 106°51'06.5"E
    const farmLat = -6.6059722;
    const farmLng = 106.8518056;

    // Calculate shortest path
    const result = pathfinder.findShortestPath(
      farmLat, 
      farmLng, 
      destinationLat, 
      destinationLng
    );

    return NextResponse.json({
      success: true,
      route: {
        distance: result.distance,
        duration: result.duration,
        path: result.path,
        waypoints: result.waypoints,
        destination: result.destination,
        farm: { lat: farmLat, lng: farmLng },
        summary: {
          totalDistance: `${result.distance.toFixed(1)} km`,
          estimatedTime: `${result.duration} minutes`,
          destinationName: destinationName || 'Unknown Location'
        }
      }
    });

  } catch (error) {
    console.error('Route calculation error:', error);
    return NextResponse.json({ 
      error: 'Failed to calculate route',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const name = searchParams.get('name') || 'Unknown Location';

    if (!lat || !lng) {
      return NextResponse.json({ 
        error: 'Latitude and longitude are required' 
      }, { status: 400 });
    }

    const farmLat = -6.6059722;
    const farmLng = 106.8518056;

    const result = pathfinder.findShortestPath(farmLat, farmLng, lat, lng);

    return NextResponse.json({
      success: true,
      route: result
    });

  } catch (error) {
    console.error('Route calculation error:', error);
    return NextResponse.json({ 
      error: 'Failed to calculate route' 
    }, { status: 500 });
  }
}