export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Fetches a driving route between two coordinates using the free OSRM API.
 * Returns an array of LatLng coordinates for drawing a Polyline.
 */
export async function fetchRoute(start: LatLng, end: LatLng): Promise<LatLng[]> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const coords = data.routes[0].geometry.coordinates;
      // OSRM returns [longitude, latitude], react-native-maps needs {latitude, longitude}
      return coords.map((c: [number, number]) => ({
        latitude: c[1],
        longitude: c[0],
      }));
    }
    return [start, end]; // Fallback to straight line if no route found
  } catch (error) {
    console.error("Error fetching route", error);
    return [start, end]; // Fallback
  }
}
