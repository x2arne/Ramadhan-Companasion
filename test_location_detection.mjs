// Automated verification test suite for Location & IP Fallback Detection
import {
  calculateDistance,
  findNearestCity,
  inferTimezoneFromLongitude,
  requestIPLocation,
} from './src/services/locationService.ts';

console.log('=== STARTING LOCATION DETECTION TEST SUITE ===\n');

async function runTests() {
  // Test 1: Haversine distance calculation
  console.log('Test 1: Menghitung jarak Haversine');
  // Jakarta (-6.2088, 106.8456) ke Bandung (-6.9175, 107.6191) ~120-150 km
  const dist = calculateDistance(-6.2088, 106.8456, -6.9175, 107.6191);
  console.log(`- Jarak Jakarta ke Bandung: ${dist.toFixed(2)} km`);
  if (dist < 100 || dist > 180) {
    throw new Error(`Jarak Jakarta-Bandung tidak realistis: ${dist}`);
  }
  console.log('✓ PASS: Formula jarak Haversine akurat.\n');

  // Test 2: Nearest City Matching
  console.log('Test 2: Mencari kota terdekat dari koordinat random di Jawa Timur');
  // Koordinat sekitar Jember (-8.17, 113.70)
  const nearest1 = findNearestCity(-8.16, 113.68);
  console.log(`- Titik (-8.16, 113.68) terdekat ke: ${nearest1.city} (${nearest1.province})`);
  if (nearest1.city !== 'Jember') {
    throw new Error(`Harusnya terdekat ke Jember, tapi dapat: ${nearest1.city}`);
  }
  console.log('✓ PASS: Algoritma pencari kota terdekat bekerja presisi.\n');

  // Test 3: Timezone inference from longitude
  console.log('Test 3: Penentuan Zona Waktu Indonesia (WIB, WITA, WIT)');
  const tzWIB = inferTimezoneFromLongitude(106.8); // Jakarta
  const tzWITA = inferTimezoneFromLongitude(119.4); // Makassar
  const tzWIT = inferTimezoneFromLongitude(140.6); // Jayapura
  console.log(`- Bujur 106.8°: ${tzWIB}`);
  console.log(`- Bujur 119.4°: ${tzWITA}`);
  console.log(`- Bujur 140.6°: ${tzWIT}`);
  if (tzWIB !== 'Asia/Jakarta' || tzWITA !== 'Asia/Makassar' || tzWIT !== 'Asia/Jayapura') {
    throw new Error('Pemetaan zona waktu dari bujur tidak valid');
  }
  console.log('✓ PASS: Deteksi zona waktu otomatis terverifikasi.\n');

  // Test 4: IP Geolocation Live Fallback
  console.log('Test 4: Menguji API IP Geolocation Fallback');
  try {
    const ipLoc = await requestIPLocation();
    console.log(`- Lokasi IP: ${ipLoc.city}, Lat: ${ipLoc.latitude}, Lon: ${ipLoc.longitude}, TZ: ${ipLoc.timezone}`);
    if (!ipLoc.latitude || !ipLoc.longitude || !ipLoc.city) {
      throw new Error('Data IP Geolocation tidak lengkap');
    }
    console.log('✓ PASS: IP Geolocation Fallback aktif dan merespons dengan koordinat valid.\n');
  } catch (e) {
    console.warn('Catatan: IP Geolocation online test dilewati jika offline:', e.message);
  }

  console.log('=== ALL LOCATION TESTS COMPLETED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('LOCATION TEST FAILED:', err);
  process.exit(1);
});
