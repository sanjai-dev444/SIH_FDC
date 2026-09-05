import { Geolocation } from '@capacitor/geolocation';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  address: string;
  city: string;
}

export const TN_CITIES = [
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9672, landmark: 'Gandhipuram Central Sector, Coimbatore' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, landmark: 'Koyambedu / Chennai Central Sector' },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, landmark: 'Mattuthavani Integrated Terminal, Madurai' },
  { name: 'Salem', lat: 11.6643, lng: 78.1460, landmark: 'New Bus Stand Sector, Salem' },
  { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.6856, landmark: 'Central Bus Stand, Cantonment, Trichy' },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, landmark: 'Junction Sector, Tirunelveli' },
  { name: 'Erode', lat: 11.3410, lng: 77.7172, landmark: 'Brough Road Junction, Erode' }
];

export const detectNearestCity = (lat: number, lng: number): string => {
  // Check if close to Coimbatore (~10.8 to 11.3, 76.8 to 77.3)
  if (lat >= 10.7 && lat <= 11.4 && lng >= 76.7 && lng <= 77.3) {
    return 'Coimbatore';
  }
  // Check Chennai (~12.8 to 13.3, 80.0 to 80.4)
  if (lat >= 12.8 && lat <= 13.4 && lng >= 79.9 && lng <= 80.4) {
    return 'Chennai';
  }
  // Check Madurai (~9.7 to 10.1, 78.0 to 78.3)
  if (lat >= 9.7 && lat <= 10.2 && lng >= 77.9 && lng <= 78.4) {
    return 'Madurai';
  }

  // Calculate closest city distance
  let minDistance = Infinity;
  let closestCity = 'Coimbatore'; // Default to Coimbatore as requested!

  for (const city of TN_CITIES) {
    const dist = Math.hypot(city.lat - lat, city.lng - lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city.name;
    }
  }

  return closestCity;
};

export const getCurrentPosition = async (preferredCity?: string): Promise<LocationCoordinates> => {
  // If user selected a specific preferred city (like Coimbatore), prioritize it
  if (preferredCity) {
    const cityData = TN_CITIES.find(c => c.name.toLowerCase() === preferredCity.toLowerCase()) || TN_CITIES[0];
    return {
      latitude: cityData.lat,
      longitude: cityData.lng,
      accuracy: 5,
      address: cityData.landmark,
      city: cityData.name,
    };
  }

  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
    });

    const lat = Number(position.coords.latitude.toFixed(5));
    const lng = Number(position.coords.longitude.toFixed(5));
    const city = detectNearestCity(lat, lng);

    return {
      latitude: lat,
      longitude: lng,
      accuracy: Math.round(position.coords.accuracy || 10),
      address: `${city} Sector (GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
      city,
    };
  } catch (err) {
    console.warn('Native geolocation failed, using browser geolocation or Coimbatore default:', err);

    if ('geolocation' in navigator) {
      try {
        const browserPos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3500 });
        });

        const lat = Number(browserPos.coords.latitude.toFixed(5));
        const lng = Number(browserPos.coords.longitude.toFixed(5));
        const city = detectNearestCity(lat, lng);

        return {
          latitude: lat,
          longitude: lng,
          accuracy: Math.round(browserPos.coords.accuracy || 15),
          address: `${city} District (GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
          city,
        };
      } catch {
        // fallback to Coimbatore
      }
    }

    // Default to Coimbatore as requested by user
    const coimbatore = TN_CITIES[0];
    return {
      latitude: coimbatore.lat,
      longitude: coimbatore.lng,
      accuracy: 5,
      address: coimbatore.landmark,
      city: 'Coimbatore',
    };
  }
};
