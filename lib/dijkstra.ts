interface Node {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Edge {
  from: string;
  to: string;
  distance: number;
}

class DijkstraPathfinder {
  private nodes: Node[] = [
    // Original nodes
    { id: 'jakarta', name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
    { id: 'bogor', name: 'Bogor', lat: -6.5971, lng: 106.8060 },
    { id: 'depok', name: 'Depok', lat: -6.4025, lng: 106.7942 },
    { id: 'bekasi', name: 'Bekasi', lat: -6.2383, lng: 106.9756 },
    { id: 'tangerang', name: 'Tangerang', lat: -6.1783, lng: 106.6319 },
    
    // NEW NODES around your area for better routing
    { id: 'sukaraja', name: 'Sukaraja', lat: -6.605898, lng: 106.851755 }, // Near your farm
    { id: 'cibubur', name: 'Cibubur', lat: -6.365, lng: 106.899 },
    { id: 'sentul', name: 'Sentul', lat: -6.565, lng: 106.835 },
    { id: 'citeureup', name: 'Citeureup', lat: -6.485, lng: 106.815 },
    { id: 'cileungsi', name: 'Cileungsi', lat: -6.395, lng: 106.961 },
    { id: 'gunung_putri', name: 'Gunung Putri', lat: -6.425, lng: 106.885 },
    { id: 'parung', name: 'Parung', lat: -6.421, lng: 106.733 },
    { id: 'ciawi', name: 'Ciawi', lat: -6.644, lng: 106.854 },
    { id: 'leuwiliang', name: 'Leuwiliang', lat: -6.549, lng: 106.677 },
  ];

  private edges: Edge[] = [
    // Original edges
    { from: 'jakarta', to: 'bogor', distance: 54 },
    { from: 'jakarta', to: 'depok', distance: 20 },
    { from: 'jakarta', to: 'bekasi', distance: 23 },
    { from: 'jakarta', to: 'tangerang', distance: 25 },
    { from: 'depok', to: 'bogor', distance: 35 },
    { from: 'bekasi', to: 'depok', distance: 30 },
    
    // NEW EDGES connecting your local area
    { from: 'bogor', to: 'sukaraja', distance: 8 },
    { from: 'bogor', to: 'ciawi', distance: 12 },
    { from: 'bogor', to: 'parung', distance: 25 },
    { from: 'bogor', to: 'sentul', distance: 18 },
    { from: 'depok', to: 'cibubur', distance: 15 },
    { from: 'depok', to: 'gunung_putri', distance: 20 },
    { from: 'bekasi', to: 'cileungsi', distance: 15 },
    { from: 'bekasi', to: 'gunung_putri', distance: 25 },
    { from: 'cibubur', to: 'gunung_putri', distance: 12 },
    { from: 'cibubur', to: 'sentul', distance: 22 },
    { from: 'sentul', to: 'citeureup', distance: 15 },
    { from: 'sentul', to: 'sukaraja', distance: 10 },
    { from: 'citeureup', to: 'sukaraja', distance: 18 },
    { from: 'gunung_putri', to: 'cileungsi', distance: 18 },
    { from: 'sukaraja', to: 'ciawi', distance: 8 },
    { from: 'parung', to: 'leuwiliang', distance: 20 },
    { from: 'leuwiliang', to: 'ciawi', distance: 25 },
  ];

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Find the nearest node to given coordinates
  private findNearestNode(lat: number, lng: number): Node {
    let nearestNode = this.nodes[0];
    let shortestDistance = this.calculateDistance(lat, lng, nearestNode.lat, nearestNode.lng);

    for (const node of this.nodes) {
      const distance = this.calculateDistance(lat, lng, node.lat, node.lng);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestNode = node;
      }
    }

    return nearestNode;
  }

  // Dijkstra's algorithm implementation
  findShortestPath(startLat: number, startLng: number, endLat: number, endLng: number): { 
    distance: number; 
    waypoints: Node[] 
  } {
    const startNode = this.findNearestNode(startLat, startLng);
    const endNode = this.findNearestNode(endLat, endLng);

    if (startNode.id === endNode.id) {
      return {
        distance: this.calculateDistance(startLat, startLng, endLat, endLng),
        waypoints: [startNode]
      };
    }

    // Build adjacency list
    const graph: { [key: string]: { node: string; distance: number }[] } = {};
    this.nodes.forEach(node => {
      graph[node.id] = [];
    });

    this.edges.forEach(edge => {
      graph[edge.from].push({ node: edge.to, distance: edge.distance });
      graph[edge.to].push({ node: edge.from, distance: edge.distance });
    });

    // Dijkstra's algorithm
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set(this.nodes.map(n => n.id));

    // Initialize distances
    this.nodes.forEach(node => {
      distances[node.id] = node.id === startNode.id ? 0 : Infinity;
      previous[node.id] = null;
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentNode: string | null = null;
      for (const nodeId of unvisited) {
        if (currentNode === null || distances[nodeId] < distances[currentNode]) {
          currentNode = nodeId;
        }
      }

      if (currentNode === null || distances[currentNode] === Infinity) break;

      unvisited.delete(currentNode);

      // Update distances to neighbors
      for (const neighbor of graph[currentNode] || []) {
        if (unvisited.has(neighbor.node)) {
          const alt = distances[currentNode] + neighbor.distance;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = currentNode;
          }
        }
      }

      if (currentNode === endNode.id) break;
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = endNode.id;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    const waypoints = path.map(nodeId => this.nodes.find(n => n.id === nodeId)!);
    
    // Add distance from start to first node and from last node to end
    const totalDistance = distances[endNode.id] + 
      this.calculateDistance(startLat, startLng, startNode.lat, startNode.lng) +
      this.calculateDistance(endNode.lat, endNode.lng, endLat, endLng);

    return {
      distance: totalDistance,
      waypoints
    };
  }
}

export { DijkstraPathfinder };