import type { UserLocation } from '../types';

export interface CityPreset extends UserLocation {
  province?: string;
}

export const INDONESIAN_CITIES: CityPreset[] = [
  // Jawa
  { city: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { city: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
  { city: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
  { city: 'Semarang', province: 'Jawa Tengah', country: 'Indonesia', latitude: -6.9667, longitude: 110.4167, timezone: 'Asia/Jakarta' },
  { city: 'Yogyakarta', province: 'DI Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
  { city: 'Bekasi', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.2383, longitude: 106.9756, timezone: 'Asia/Jakarta' },
  { city: 'Tangerang', province: 'Banten', country: 'Indonesia', latitude: -6.1783, longitude: 106.6319, timezone: 'Asia/Jakarta' },
  { city: 'Depok', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.4025, longitude: 106.7942, timezone: 'Asia/Jakarta' },
  { city: 'Bogor', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.5971, longitude: 106.8060, timezone: 'Asia/Jakarta' },
  // Jawa Timur (Lengkap)
  { city: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
  { city: 'Malang', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.9666, longitude: 112.6326, timezone: 'Asia/Jakarta' },
  { city: 'Sidoarjo', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.4478, longitude: 112.7183, timezone: 'Asia/Jakarta' },
  { city: 'Gresik', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.1566, longitude: 112.6555, timezone: 'Asia/Jakarta' },
  { city: 'Banyuwangi', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.2192, longitude: 114.3691, timezone: 'Asia/Jakarta' },
  { city: 'Jember', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.1724, longitude: 113.6995, timezone: 'Asia/Jakarta' },
  { city: 'Kediri', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.8480, longitude: 112.0178, timezone: 'Asia/Jakarta' },
  { city: 'Madiun', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.6298, longitude: 111.5239, timezone: 'Asia/Jakarta' },
  { city: 'Pasuruan', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.6453, longitude: 112.9075, timezone: 'Asia/Jakarta' },
  { city: 'Probolinggo', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.7543, longitude: 113.2159, timezone: 'Asia/Jakarta' },
  { city: 'Blitar', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.0954, longitude: 112.1609, timezone: 'Asia/Jakarta' },
  { city: 'Bojonegoro', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.1502, longitude: 111.8817, timezone: 'Asia/Jakarta' },
  { city: 'Tuban', province: 'Jawa Timur', country: 'Indonesia', latitude: -6.8976, longitude: 112.0649, timezone: 'Asia/Jakarta' },
  { city: 'Lamongan', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.1197, longitude: 112.4153, timezone: 'Asia/Jakarta' },
  { city: 'Mojokerto', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.4722, longitude: 112.4339, timezone: 'Asia/Jakarta' },
  { city: 'Tulungagung', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.0655, longitude: 111.9015, timezone: 'Asia/Jakarta' },
  { city: 'Ponorogo', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.8693, longitude: 111.4623, timezone: 'Asia/Jakarta' },
  { city: 'Ngawi', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.4039, longitude: 111.4452, timezone: 'Asia/Jakarta' },
  { city: 'Magetan', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.6534, longitude: 111.3283, timezone: 'Asia/Jakarta' },
  { city: 'Nganjuk', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.6049, longitude: 111.9042, timezone: 'Asia/Jakarta' },
  { city: 'Situbondo', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.7063, longitude: 114.0044, timezone: 'Asia/Jakarta' },
  { city: 'Bondowoso', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.9135, longitude: 113.8214, timezone: 'Asia/Jakarta' },
  { city: 'Lumajang', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.1331, longitude: 113.2246, timezone: 'Asia/Jakarta' },
  { city: 'Bangkalan', province: 'Jawa Timur (Madura)', country: 'Indonesia', latitude: -7.0305, longitude: 112.7483, timezone: 'Asia/Jakarta' },
  { city: 'Sampang', province: 'Jawa Timur (Madura)', country: 'Indonesia', latitude: -7.1873, longitude: 113.2394, timezone: 'Asia/Jakarta' },
  { city: 'Pamekasan', province: 'Jawa Timur (Madura)', country: 'Indonesia', latitude: -7.1605, longitude: 113.4735, timezone: 'Asia/Jakarta' },
  { city: 'Sumenep', province: 'Jawa Timur (Madura)', country: 'Indonesia', latitude: -7.0167, longitude: 113.8667, timezone: 'Asia/Jakarta' },
  { city: 'Pacitan', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.2066, longitude: 111.0921, timezone: 'Asia/Jakarta' },
  { city: 'Trenggalek', province: 'Jawa Timur', country: 'Indonesia', latitude: -8.0500, longitude: 111.7167, timezone: 'Asia/Jakarta' },
  { city: 'Batu', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.8671, longitude: 112.5239, timezone: 'Asia/Jakarta' },

  // Sumatera
  { city: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezone: 'Asia/Jakarta' },
  { city: 'Palembang', province: 'Sumatera Selatan', country: 'Indonesia', latitude: -2.9761, longitude: 104.7754, timezone: 'Asia/Jakarta' },
  { city: 'Banda Aceh', province: 'Aceh', country: 'Indonesia', latitude: 5.5483, longitude: 95.3238, timezone: 'Asia/Jakarta' },
  { city: 'Padang', province: 'Sumatera Barat', country: 'Indonesia', latitude: -0.9471, longitude: 100.4172, timezone: 'Asia/Jakarta' },
  { city: 'Pekanbaru', province: 'Riau', country: 'Indonesia', latitude: 0.5071, longitude: 101.4478, timezone: 'Asia/Jakarta' },
  { city: 'Bandar Lampung', province: 'Lampung', country: 'Indonesia', latitude: -5.4500, longitude: 105.2667, timezone: 'Asia/Jakarta' },
  { city: 'Batam', province: 'Kepulauan Riau', country: 'Indonesia', latitude: 1.1301, longitude: 104.0529, timezone: 'Asia/Jakarta' },
  { city: 'Jambi', province: 'Jambi', country: 'Indonesia', latitude: -1.6101, longitude: 103.6131, timezone: 'Asia/Jakarta' },
  { city: 'Bengkulu', province: 'Bengkulu', country: 'Indonesia', latitude: -3.8004, longitude: 102.2655, timezone: 'Asia/Jakarta' },
  { city: 'Pangkalpinang', province: 'Bangka Belitung', country: 'Indonesia', latitude: -2.1333, longitude: 106.1167, timezone: 'Asia/Jakarta' },

  // Kalimantan
  { city: 'Banjarmasin', province: 'Kalimantan Selatan', country: 'Indonesia', latitude: -3.3194, longitude: 114.5908, timezone: 'Asia/Makassar' },
  { city: 'Samarinda', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -0.5016, longitude: 117.1265, timezone: 'Asia/Makassar' },
  { city: 'Balikpapan', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -1.2379, longitude: 116.8289, timezone: 'Asia/Makassar' },
  { city: 'Pontianak', province: 'Kalimantan Barat', country: 'Indonesia', latitude: -0.0263, longitude: 109.3425, timezone: 'Asia/Jakarta' },
  { city: 'Palangkaraya', province: 'Kalimantan Tengah', country: 'Indonesia', latitude: -2.2161, longitude: 113.9167, timezone: 'Asia/Jakarta' },
  { city: 'Tarakan', province: 'Kalimantan Utara', country: 'Indonesia', latitude: 3.3270, longitude: 117.5786, timezone: 'Asia/Makassar' },
  { city: 'IKN (Nusantara)', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -0.9744, longitude: 116.7099, timezone: 'Asia/Makassar' },

  // Sulawesi
  { city: 'Makassar', province: 'Sulawesi Selatan', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezone: 'Asia/Makassar' },
  { city: 'Manado', province: 'Sulawesi Utara', country: 'Indonesia', latitude: 1.4748, longitude: 124.8428, timezone: 'Asia/Makassar' },
  { city: 'Palu', province: 'Sulawesi Tengah', country: 'Indonesia', latitude: -0.9003, longitude: 119.8779, timezone: 'Asia/Makassar' },
  { city: 'Kendari', province: 'Sulawesi Tenggara', country: 'Indonesia', latitude: -3.9985, longitude: 122.5126, timezone: 'Asia/Makassar' },
  { city: 'Gorontalo', province: 'Gorontalo', country: 'Indonesia', latitude: 0.5435, longitude: 123.0568, timezone: 'Asia/Makassar' },
  { city: 'Mamuju', province: 'Sulawesi Barat', country: 'Indonesia', latitude: -2.6770, longitude: 118.8870, timezone: 'Asia/Makassar' },

  // Bali & Nusa Tenggara
  { city: 'Denpasar', province: 'Bali', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  { city: 'Mataram', province: 'Nusa Tenggara Barat', country: 'Indonesia', latitude: -8.5833, longitude: 116.1167, timezone: 'Asia/Makassar' },
  { city: 'Kupang', province: 'Nusa Tenggara Timur', country: 'Indonesia', latitude: -10.1772, longitude: 123.6070, timezone: 'Asia/Makassar' },

  // Maluku & Papua
  { city: 'Ambon', province: 'Maluku', country: 'Indonesia', latitude: -3.6547, longitude: 128.1906, timezone: 'Asia/Jayapura' },
  { city: 'Ternate', province: 'Maluku Utara', country: 'Indonesia', latitude: 0.7904, longitude: 127.3809, timezone: 'Asia/Jayapura' },
  { city: 'Jayapura', province: 'Papua', country: 'Indonesia', latitude: -2.5916, longitude: 140.6690, timezone: 'Asia/Jayapura' },
  { city: 'Sorong', province: 'Papua Barat Daya', country: 'Indonesia', latitude: -0.8762, longitude: 131.2558, timezone: 'Asia/Jayapura' },

  // Internasional (Kota Suci)
  { city: 'Makkah', province: 'Hejaz', country: 'Arab Saudi', latitude: 21.3891, longitude: 39.8579, timezone: 'Asia/Riyadh' },
  { city: 'Madinah', province: 'Hejaz', country: 'Arab Saudi', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
];

/**
 * Hitung jarak Haversine (dalam kilometer) antara dua koordinat
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius bumi km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Cari kota Indonesia terdekat dari koordinat GPS
 */
export function findNearestCity(latitude: number, longitude: number): CityPreset {
  let nearest = INDONESIAN_CITIES[0];
  let minDistance = Infinity;

  for (const city of INDONESIAN_CITIES) {
    const dist = calculateDistance(latitude, longitude, city.latitude, city.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  }

  return nearest;
}

/**
 * Tentukan zona waktu Indonesia otomatis berdasarkan bujur (longitude)
 */
export function inferTimezoneFromLongitude(longitude: number): string {
  if (longitude < 110) {
    return 'Asia/Jakarta'; // WIB (UTC+7)
  } else if (longitude < 125) {
    return 'Asia/Makassar'; // WITA (UTC+8)
  } else {
    return 'Asia/Jayapura'; // WIT (UTC+9)
  }
}

export type LocationPermissionState =
  | 'granted'
  | 'prompt'
  | 'denied'
  | 'unsupported'
  | 'insecure_origin';

export interface LocationPermissionInfo {
  state: LocationPermissionState;
  isSecureContext: boolean;
  canUseHardwareGPS: boolean;
  message: string;
}

/**
 * Cek status izin akses lokasi dan keamanan peramban
 */
export async function checkLocationPermissionInfo(): Promise<LocationPermissionInfo> {
  const isSecure =
    typeof window !== 'undefined' &&
    (window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return {
      state: 'unsupported',
      isSecureContext: isSecure,
      canUseHardwareGPS: false,
      message: 'Peramban tidak mendukung sensor Geolocation perangkat keras.',
    };
  }

  if (!isSecure) {
    return {
      state: 'insecure_origin',
      isSecureContext: false,
      canUseHardwareGPS: false,
      message:
        'Browser HP membatasi GPS perangkat pada koneksi HTTP (192.168.x.x). Gunakan deteksi jaringan IP atau aktifkan mode HTTPS.',
    };
  }

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const res = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      if (res.state === 'granted') {
        return {
          state: 'granted',
          isSecureContext: true,
          canUseHardwareGPS: true,
          message: 'Akses GPS satelit diizinkan & siap digunakan.',
        };
      } else if (res.state === 'denied') {
        return {
          state: 'denied',
          isSecureContext: true,
          canUseHardwareGPS: false,
          message: 'Izin lokasi peramban sebelumnya ditolak. Buka setelan peramban untuk mengizinkan.',
        };
      } else {
        return {
          state: 'prompt',
          isSecureContext: true,
          canUseHardwareGPS: true,
          message: 'Memerlukan izin akses lokasi dari peramban.',
        };
      }
    }
  } catch {
    // Permissions API may not be supported or throws on some mobile browsers
  }

  return {
    state: 'prompt',
    isSecureContext: true,
    canUseHardwareGPS: true,
    message: 'Akses GPS siap diminta dari peramban.',
  };
}

/**
 * Deteksi lokasi estimasi via Jaringan Internet (IP)
 * Berguna saat akses GPS fisik dibatasi oleh browser di HTTP atau sinyal satelit tidak terjangkau
 */
export async function requestIPLocation(): Promise<UserLocation> {
  // Provider 1: freeipapi.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const lat = Number(data.latitude.toFixed(4));
        const lon = Number(data.longitude.toFixed(4));
        const nearest = findNearestCity(lat, lon);
        const timezone = data.timeZones?.[0] || inferTimezoneFromLongitude(lon);
        return {
          city: data.cityName ? `${data.cityName} (${nearest.city})` : nearest.city,
          country: data.countryName || 'Indonesia',
          latitude: lat,
          longitude: lon,
          timezone,
          isCustom: true,
          detectionSource: 'ip',
        };
      }
    }
  } catch (e) {
    console.warn('Primary IP Geolocation (freeipapi) failed, trying fallback...', e);
  }

  // Provider 2: ipwho.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const lat = Number(data.latitude.toFixed(4));
        const lon = Number(data.longitude.toFixed(4));
        const nearest = findNearestCity(lat, lon);
        const timezone = data.timezone?.id || inferTimezoneFromLongitude(lon);
        return {
          city: data.city ? `${data.city} (${nearest.city})` : nearest.city,
          country: data.country || 'Indonesia',
          latitude: lat,
          longitude: lon,
          timezone,
          isCustom: true,
          detectionSource: 'ip',
        };
      }
    }
  } catch (e) {
    console.warn('Fallback IP Geolocation (ipwho.is) failed', e);
  }

  throw new Error(
    'Gagal mendeteksi lokasi via jaringan internet (IP). Pastikan koneksi aktif atau pilih kota dari daftar.'
  );
}

export interface DeviceLocationResult {
  location: UserLocation;
  source: 'gps' | 'ip';
  note?: string;
}

/**
 * Minta lokasi perangkat pengguna dengan fallback cerdas ke IP jika GPS gagal/dibatasi
 */
export async function requestDeviceLocation(options?: {
  preferGPSOnly?: boolean;
}): Promise<DeviceLocationResult> {
  const permInfo = await checkLocationPermissionInfo();

  // Jika koneksi tidak aman (HTTP pada IP lokal e.g. 192.168.x.x di HP):
  if (!permInfo.isSecureContext) {
    if (options?.preferGPSOnly) {
      throw new Error(
        'Peramban HP otomatis memblokir sensor GPS fisik pada protokol HTTP (192.168.x.x). Gunakan deteksi jaringan IP atau aktifkan mode HTTPS.'
      );
    }
    // Langsung gunakan deteksi IP yang selalu bisa diakses tanpa batasan browser
    const ipLoc = await requestIPLocation();
    return {
      location: ipLoc,
      source: 'ip',
      note: 'Sensor GPS satelit dibatasi oleh browser di HTTP lokal. Lokasi berhasil dideteksi otomatis via Jaringan Internet (IP).',
    };
  }

  // Jika konteks aman (HTTPS atau localhost), coba Geolocation API
  if (navigator.geolocation) {
    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000,
          }
        );
      });

      const lat = Number(coords.latitude.toFixed(4));
      const lon = Number(coords.longitude.toFixed(4));
      const nearest = findNearestCity(lat, lon);
      const timezone = inferTimezoneFromLongitude(lon);

      return {
        location: {
          city: nearest.city,
          country: 'Indonesia',
          latitude: lat,
          longitude: lon,
          timezone,
          isCustom: true,
          detectionSource: 'gps',
          accuracy: coords.accuracy,
        },
        source: 'gps',
      };
    } catch (gpsError: any) {
      console.warn('GPS hardware access failed/timed out:', gpsError);

      if (options?.preferGPSOnly) {
        let msg = 'Gagal mengakses GPS perangkat.';
        if (gpsError.code === 1) {
          msg = 'Izin akses lokasi ditolak oleh peramban atau pengguna.';
        } else if (gpsError.code === 2) {
          msg = 'Informasi sinyal GPS tidak tersedia saat ini.';
        } else if (gpsError.code === 3) {
          msg = 'Waktu permintaan GPS satelit habis (timeout).';
        }
        throw new Error(msg);
      }

      // Fallback otomatis ke IP Geolocation
      try {
        const ipLoc = await requestIPLocation();
        return {
          location: ipLoc,
          source: 'ip',
          note: 'Sinyal GPS fisik tidak merespons atau izin ditolak. Lokasi dialihkan via Jaringan Internet (IP).',
        };
      } catch {
        let msg = 'Gagal mengakses sensor GPS maupun estimasi jaringan.';
        if (gpsError.code === 1) {
          msg = 'Izin lokasi ditolak di peramban. Silakan periksa izin situs atau pilih kota manual.';
        }
        throw new Error(msg);
      }
    }
  }

  // Jika Geolocation sama sekali tidak didukung
  if (options?.preferGPSOnly) {
    throw new Error('Peramban Anda tidak mendukung sensor GPS.');
  }

  const ipLoc = await requestIPLocation();
  return {
    location: ipLoc,
    source: 'ip',
    note: 'Sensor GPS tidak tersedia di browser ini. Lokasi dideteksi via Jaringan Internet (IP).',
  };
}
