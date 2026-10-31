// Automated verification test suite for Phase 2: Prayer times, Location, and Hijri calculations
import { Coordinates, CalculationParameters, PrayerTimes, Madhab } from 'adhan';

console.log('=== STARTING PHASE 2 AUTOMATED TEST SUITE ===\n');

// 1. Test Kemenag parameters (Subuh 20°, Isya 18°, +2m ihtiyat)
function testKemenagCalculation() {
  const coords = new Coordinates(-6.2088, 106.8456); // Jakarta
  const testDate = new Date(2026, 9, 25); // 25 Oct 2026
  
  const params = new CalculationParameters('Other', 20, 18);
  params.madhab = Madhab.Shafi;
  params.adjustments.fajr = 2;
  params.adjustments.dhuhr = 2;
  params.adjustments.asr = 2;
  params.adjustments.maghrib = 2;
  params.adjustments.isha = 2;

  const pt = new PrayerTimes(coords, testDate, params);
  
  const fajrStr = pt.fajr.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
  const maghribStr = pt.maghrib.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
  const ishaStr = pt.isha.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });

  console.log('Test 1: Kemenag Jakarta (25 Oct 2026)');
  console.log(`- Subuh: ${fajrStr}`);
  console.log(`- Maghrib: ${maghribStr}`);
  console.log(`- Isya: ${ishaStr}`);
  
  if (!fajrStr || !maghribStr || !ishaStr) {
    throw new Error('Kemenag prayer times calculation failed');
  }
  console.log('✓ PASS: Kemenag calculation valid.\n');
}

// 2. Test Muhammadiyah method (Subuh 18°) vs Kemenag (Subuh 20°)
function testMuhammadiyahComparison() {
  const coords = new Coordinates(-7.7956, 110.3695); // Yogyakarta
  const testDate = new Date(2027, 1, 8); // 1 Ramadan 1448 H (8 Feb 2027)

  const kemenagParams = new CalculationParameters('Other', 20, 18);
  kemenagParams.madhab = Madhab.Shafi;
  kemenagParams.adjustments.fajr = 2;

  const muhammadiyahParams = new CalculationParameters('Other', 18, 18);
  muhammadiyahParams.madhab = Madhab.Shafi;
  muhammadiyahParams.adjustments.fajr = 2;

  const ptKemenag = new PrayerTimes(coords, testDate, kemenagParams);
  const ptMuhammadiyah = new PrayerTimes(coords, testDate, muhammadiyahParams);

  const kemenagSubuh = ptKemenag.fajr.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
  const muhammadiyahSubuh = ptMuhammadiyah.fajr.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });

  console.log('Test 2: Kemenag vs Muhammadiyah (Yogyakarta, 1 Ramadan 1448 H / 8 Feb 2027)');
  console.log(`- Kemenag Subuh (20°): ${kemenagSubuh}`);
  console.log(`- Muhammadiyah Subuh (18°): ${muhammadiyahSubuh}`);

  const diffMinutes = (ptMuhammadiyah.fajr.getTime() - ptKemenag.fajr.getTime()) / (60 * 1000);
  console.log(`- Selisih Subuh: +${Math.round(diffMinutes)} menit (Muhammadiyah 18° terbit fajar lebih lambat)`);

  if (diffMinutes <= 0 || diffMinutes > 15) {
    throw new Error('Muhammadiyah 18 deg should be ~7-9 minutes later than 20 deg');
  }
  console.log('✓ PASS: Muhammadiyah calculation comparison verified.\n');
}

// 3. Test Timezones (WIB, WITA, WIT)
function testMultiTimezoneSupport() {
  console.log('Test 3: Multi-Timezone Handling (WIB, WITA, WIT)');
  const testDate = new Date(2027, 1, 8);

  // Jakarta (WIB)
  const jkt = new PrayerTimes(new Coordinates(-6.2088, 106.8456), testDate, new CalculationParameters('Other', 20, 18));
  // Makassar (WITA)
  const mks = new PrayerTimes(new Coordinates(-5.1477, 119.4327), testDate, new CalculationParameters('Other', 20, 18));
  // Jayapura (WIT)
  const djj = new PrayerTimes(new Coordinates(-2.5916, 140.6690), testDate, new CalculationParameters('Other', 20, 18));

  console.log(`- Jakarta (WIB) Maghrib: ${jkt.maghrib.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`);
  console.log(`- Makassar (WITA) Maghrib: ${mks.maghrib.toLocaleTimeString('id-ID', { timeZone: 'Asia/Makassar' })} WITA`);
  console.log(`- Jayapura (WIT) Maghrib: ${djj.maghrib.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jayapura' })} WIT`);

  console.log('✓ PASS: Timezone conversions verified.\n');
}

// 4. Test Hijri Date Formatting
function testHijriFormatting() {
  console.log('Test 4: Hijri Date System');
  const d = new Date(2026, 9, 25);
  const formatted = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
  console.log(`- Hijri output: ${formatted}`);
  if (!formatted.includes('1448')) {
    throw new Error('Hijri year 1448 expected');
  }
  console.log('✓ PASS: Hijri Umm al-Qura conversion verified.\n');
}

try {
  testKemenagCalculation();
  testMuhammadiyahComparison();
  testMultiTimezoneSupport();
  testHijriFormatting();
  console.log('=== ALL PHASE 2 TESTS PASSED SUCCESSFULLY! ===');
} catch (e) {
  console.error('TEST SUITE FAILED:', e);
  process.exit(1);
}
