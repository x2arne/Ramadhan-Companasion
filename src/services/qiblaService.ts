// Service to calculate Qibla Direction & Distance to Ka'bah in Makkah

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
  name: "Ka'bah, Masjidil Haram",
  city: 'Makkah Al-Mukarramah',
  country: 'Arab Saudi',
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Calculates the forward azimuth bearing from user coordinates to Ka'bah
 * Formula: Spherical Trigonometry
 * q = atan2(sin(Δλ), cos(φ1)*tan(φ2) - sin(φ1)*cos(Δλ))
 */
export const calculateQiblaAngle = (latitude: number, longitude: number): number => {
  const lat1 = toRad(latitude);
  const lon1 = toRad(longitude);
  const lat2 = toRad(KAABA_COORDINATES.latitude);
  const lon2 = toRad(KAABA_COORDINATES.longitude);

  const deltaLon = lon2 - lon1;

  const y = Math.sin(deltaLon);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLon);

  let qibla = toDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;

  return Math.round(qibla * 10) / 10;
};

/**
 * Calculates great-circle distance from user coordinates to Ka'bah in kilometers
 */
export const calculateDistanceToKaaba = (latitude: number, longitude: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(KAABA_COORDINATES.latitude - latitude);
  const dLon = toRad(KAABA_COORDINATES.longitude - longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(latitude)) *
      Math.cos(toRad(KAABA_COORDINATES.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Returns human-readable Indonesian cardinal direction
 */
export const getCardinalDirection = (deg: number): string => {
  const normalized = (deg + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'Utara (U)';
  if (normalized >= 22.5 && normalized < 67.5) return 'Timur Laut (TL)';
  if (normalized >= 67.5 && normalized < 112.5) return 'Timur (T)';
  if (normalized >= 112.5 && normalized < 157.5) return 'Tenggara (TG)';
  if (normalized >= 157.5 && normalized < 202.5) return 'Selatan (S)';
  if (normalized >= 202.5 && normalized < 247.5) return 'Barat Daya (BD)';
  if (normalized >= 247.5 && normalized < 292.5) return 'Barat (B)';
  return 'Barat Laut (BL)';
};

