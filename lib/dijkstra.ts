interface Node {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}

interface Edge {
  from: string;
  to: string;
  weight: number; // distance in km or travel time in minutes
  type?: 'highway' | 'main_road' | 'local_road';
}

interface Graph {
  nodes: Map<string, Node>;
  edges: Map<string, Edge[]>;
}

class DijkstraPathfinder {
  private graph: Graph;

  constructor() {
    this.graph = {
      nodes: new Map(),
      edges: new Map()
    };
    this.initializeJakartaGraph();
  }

  // Initialize with basic Jakarta road network (simplified)
  private initializeJakartaGraph() {
    // Major nodes in Jakarta area (you can expand this)
    const nodes: Node[] = [
      // Quail Farm location
      { id: 'farm', lat: -6.6059722, lng: 106.8518056, name: 'Quail Farm' },
      
      // Major Jakarta locations
      { id: 'monas', lat: -6.1751, lng: 106.8272, name: 'Monas' },
      { id: 'senayan', lat: -6.2297, lng: 106.8019, name: 'Senayan' },
      { id: 'kemayoran', lat: -6.1669, lng: 106.8492, name: 'Kemayoran' },
      { id: 'cikini', lat: -6.1958, lng: 106.8414, name: 'Cikini' },
      { id: 'manggarai', lat: -6.2103, lng: 106.8494, name: 'Manggarai' },
      { id: 'kuningan', lat: -6.2383, lng: 106.8317, name: 'Kuningan' },
      { id: 'blok_m', lat: -6.2442, lng: 106.7978, name: 'Blok M' },
      { id: 'pondok_indah', lat: -6.2661, lng: 106.7831, name: 'Pondok Indah' },
      { id: 'fatmawati', lat: -6.2925, lng: 106.7994, name: 'Fatmawati' },
      { id: 'depok', lat: -6.4025, lng: 106.7942, name: 'Depok' },
      { id: 'bekasi', lat: -6.2383, lng: 106.9756, name: 'Bekasi' },
      { id: 'tangerang', lat: -6.1783, lng: 106.6319, name: 'Tangerang' },
      { id: 'bogor', lat: -6.5944, lng: 106.7889, name: 'Bogor' },
    ];

    // Add nodes to graph
    nodes.forEach(node => {
      this.graph.nodes.set(node.id, node);
      this.graph.edges.set(node.id, []);
    });

    // Define major routes (simplified road network)
    const edges: Edge[] = [
      // From farm to major highways
      { from: 'farm', to: 'bogor', weight: 15, type: 'main_road' },
      { from: 'farm', to: 'depok', weight: 25, type: 'main_road' },
      
      // Major highway connections
      { from: 'bogor', to: 'depok', weight: 20, type: 'highway' },
      { from: 'depok', to: 'fatmawati', weight: 15, type: 'highway' },
      { from: 'fatmawati', to: 'blok_m', weight: 8, type: 'main_road' },
      { from: 'fatmawati', to: 'pondok_indah', weight: 10, type: 'main_road' },
      { from: 'blok_m', to: 'senayan', weight: 12, type: 'main_road' },
      { from: 'pondok_indah', to: 'kuningan', weight: 15, type: 'main_road' },
      { from: 'senayan', to: 'kuningan', weight: 8, type: 'main_road' },
      { from: 'kuningan', to: 'cikini', weight: 10, type: 'main_road' },
      { from: 'cikini', to: 'monas', weight: 8, type: 'main_road' },
      { from: 'cikini', to: 'manggarai', weight: 6, type: 'main_road' },
      { from: 'monas', to: 'kemayoran', weight: 10, type: 'main_road' },
      { from: 'kemayoran', to: 'bekasi', weight: 25, type: 'highway' },
      { from: 'monas', to: 'tangerang', weight: 30, type: 'highway' },
    ];

    // Add bidirectional edges
    edges.forEach(edge => {
      this.addEdge(edge.from, edge.to, edge.weight, edge.type);
      this.addEdge(edge.to, edge.from, edge.weight, edge.type); // Bidirectional
    });
  }

  private addEdge(from: string, to: string, weight: number, type?: 'highway' | 'main_road' | 'local_road') {
    const edges = this.graph.edges.get(from) || [];
    edges.push({ from, to, weight, type });
    this.graph.edges.set(from, edges);
  }

  // Calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Find nearest node to given coordinates
  private findNearestNode(lat: number, lng: number): string {
    let nearestNode = '';
    let minDistance = Infinity;

    this.graph.nodes.forEach((node, id) => {
      if (id === 'farm') return; // Skip farm node
      const distance = this.calculateDistance(lat, lng, node.lat, node.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = id;
      }
    });

    return nearestNode;
  }

  // Dijkstra's algorithm implementation
  public findShortestPath(startLat: number, startLng: number, endLat: number, endLng: number) {
    const start = 'farm';
    const end = this.findNearestNode(endLat, endLng);

    if (!end) {
      throw new Error('No suitable destination node found');
    }

    // Initialize distances and previous nodes
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();
    const queue = new Set<string>();

    // Initialize all distances to infinity
    this.graph.nodes.forEach((_, nodeId) => {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
      queue.add(nodeId);
    });

    // Distance from start to start is 0
    distances.set(start, 0);

    while (queue.size > 0) {
      // Find unvisited node with minimum distance
      let current = '';
      let minDistance = Infinity;
      queue.forEach(nodeId => {
        const distance = distances.get(nodeId) || Infinity;
        if (distance < minDistance) {
          minDistance = distance;
          current = nodeId;
        }
      });

      if (current === '' || minDistance === Infinity) break;

      queue.delete(current);
      visited.add(current);

      // If we reached the destination
      if (current === end) break;

      // Check all neighbors
      const edges = this.graph.edges.get(current) || [];
      edges.forEach(edge => {
        if (visited.has(edge.to)) return;

        const alt = (distances.get(current) || 0) + edge.weight;
        if (alt < (distances.get(edge.to) || Infinity)) {
          distances.set(edge.to, alt);
          previous.set(edge.to, current);
        }
      });
    }

    // Reconstruct path - FIXED: Ensure path includes the farm
    const path: string[] = [];
    let current: string | null = end;
    
    // Build path from end to start
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    // Ensure farm is included in the path if it's not already
    if (path.length === 0 || path[0] !== 'farm') {
      path.unshift('farm');
    }

    // Calculate total distance including direct distances to start/end points
    const farmNode = this.graph.nodes.get('farm')!;
    const endNode = this.graph.nodes.get(end);
    
    // Handle case where end node doesn't exist
    if (!endNode) {
      throw new Error(`End node '${end}' not found in graph`);
    }

    const directDistanceToEnd = this.calculateDistance(endNode.lat, endNode.lng, endLat, endLng);
    const pathDistance = distances.get(end) || 0;
    
    // If no path was found, calculate direct distance from farm
    const totalDistance = pathDistance === Infinity 
      ? this.calculateDistance(farmNode.lat, farmNode.lng, endLat, endLng)
      : pathDistance + directDistanceToEnd;

    return {
      path,
      distance: totalDistance,
      duration: this.estimateDuration(totalDistance),
      waypoints: path.map(nodeId => {
        const node = this.graph.nodes.get(nodeId);
        if (!node) {
          console.warn(`Warning: Node '${nodeId}' not found in graph`);
          return { id: nodeId, lat: 0, lng: 0, name: `Unknown (${nodeId})` };
        }
        return node;
      }),
      destination: { lat: endLat, lng: endLng },
      success: pathDistance !== Infinity
    };
  }

  // Estimate duration based on distance and road types
  private estimateDuration(distance: number): number {
    // Average speed: 40 km/h in city traffic
    return Math.round((distance / 40) * 60); // in minutes
  }

  // Add method to get all available nodes (useful for debugging)
  public getAvailableNodes(): Node[] {
    return Array.from(this.graph.nodes.values());
  }

  // Add method to check if path exists between two nodes
  public hasPath(startNodeId: string, endNodeId: string): boolean {
    const visited = new Set<string>();
    const queue = [startNodeId];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === endNodeId) return true;
      if (visited.has(current)) continue;
      
      visited.add(current);
      const edges = this.graph.edges.get(current) || [];
      edges.forEach(edge => {
        if (!visited.has(edge.to)) {
          queue.push(edge.to);
        }
      });
    }
    
    return false;
  }
}

export { DijkstraPathfinder };
export type { Node, Edge, Graph };