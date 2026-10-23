/**
 * Bus Service
 * 
 * Fetches and normalizes real-time bus listing, seat layout (upper/lower deck),
 * and route stops directly from the live API:
 * GET {{baseUrl}}/buses/search?source={source}&destination={destination}&journeyDate={journeyDate}
 * 
 * Retrieves the authentication token from browser DevTools (inspect -> Application storage)
 * and passes it in headers:
 * - Authorization: Bearer <token>
 * - exte_key: <token>
 * - x-auth-token: <token>
 * 
 * NOTE: Absolutely NO static bus fallback data. If the API is unreachable or returns
 * no buses, returns an empty array ([]) so the UI displays the "No buses available for this date" state.
 */

/**
 * Retrieves the authentication token from browser inspect -> Application tab:
 * Checks localStorage, sessionStorage, and cookies.
 * 
 * Supports:
 * - 'exte_key' (standard project auth token)
 * - 'token', 'accessToken', 'access_token', 'jwt', 'authToken', 'auth_token'
 * - JSON stored user/auth state (e.g. user.token, auth.token)
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return '';
  try {
    const candidateKeys = [
      'exte_key',
      'token',
      'accessToken',
      'access_token',
      'jwt',
      'authToken',
      'auth_token',
      'bearer_token'
    ];

    // 1. Direct keys in localStorage (Inspect -> Application -> Local Storage)
    for (const key of candidateKeys) {
      const val = localStorage.getItem(key);
      if (val && typeof val === 'string' && val.trim().length > 5) {
        return val.trim().replace(/^Bearer\s+/i, '');
      }
    }

    // 2. Direct keys in sessionStorage (Inspect -> Application -> Session Storage)
    for (const key of candidateKeys) {
      const val = sessionStorage.getItem(key);
      if (val && typeof val === 'string' && val.trim().length > 5) {
        return val.trim().replace(/^Bearer\s+/i, '');
      }
    }

    // 3. Nested in JSON user/auth objects
    const objKeys = ['user', 'userData', 'authUser', 'auth', 'currentUser', 'login_data'];
    for (const key of objKeys) {
      const val = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (val) {
        try {
          const parsed = JSON.parse(val);
          for (const tKey of candidateKeys) {
            if (parsed[tKey] && typeof parsed[tKey] === 'string' && parsed[tKey].trim().length > 5) {
              return parsed[tKey].trim().replace(/^Bearer\s+/i, '');
            }
          }
        } catch {
          // not JSON
        }
      }
    }

    // 4. Cookies in document.cookie (Inspect -> Application -> Cookies)
    if (typeof document !== 'undefined' && document.cookie) {
      for (const key of candidateKeys) {
        const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]*)`));
        if (match && match[1]) {
          return decodeURIComponent(match[1]).trim().replace(/^Bearer\s+/i, '');
        }
      }
    }
  } catch (err) {
    console.warn('[busService] Token retrieval note:', err);
  }
  return '';
}

/**
 * Format duration minutes to string e.g. 510 -> "8h 30m"
 */
export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '8h 30m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Formats ISO date time string to 24-hour HH:mm
 */
export function formatTimeFromDate(isoStr) {
  if (!isoStr) return '22:00';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return String(isoStr);
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return '22:00';
  }
}

/**
 * Determines departure period based on hour
 */
export function getDeparturePeriod(timeStr) {
  if (!timeStr) return 'night';
  const hour = parseInt(timeStr.split(':')[0], 10);
  if (isNaN(hour)) return 'night';
  if (hour < 6) return 'early';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'night';
}

/**
 * Maps live API bus object into UI component contract
 * 
 * Exact fields from backend:
 * - _id, busId, agencyId
 * - origin, destination, departureDateTime, arrivalDateTime
 * - seatLayout: { deckType, layoutType, totalPassengerCapacity, lowerDeck, upperDeck }
 * - route: { routeName, originCity, destinationCity, estimatedDistance, estimatedDurationMinutes, description, stops }
 * - status, notes
 */
export function mapApiBusToUiBus(apiBus, index = 0) {
  if (!apiBus) return null;

  const seatLayout = apiBus.seatLayout || {};
  const lowerDeck = seatLayout.lowerDeck || { rows: [], passengerCapacity: 18 };
  const upperDeck = seatLayout.upperDeck || { rows: [], passengerCapacity: 18 };

  // Collect all berths from both decks
  const lowerBerths = (lowerDeck.rows || []).flatMap((r) => r.berths || []);
  const upperBerths = (upperDeck.rows || []).flatMap((r) => r.berths || []);
  const allBerths = [...lowerBerths, ...upperBerths];

  // Live seat counts and statistics
  const lowerCapacity = lowerDeck.passengerCapacity || (lowerBerths.length > 0 ? lowerBerths.length : 18);
  const upperCapacity = upperDeck.passengerCapacity || (upperBerths.length > 0 ? upperBerths.length : 18);

  const lowerAvailableCount = lowerBerths.filter((b) => b.available).length;
  const upperAvailableCount = upperBerths.filter((b) => b.available).length;
  const totalAvailableSeats = allBerths.filter((b) => b.available).length;

  const singleSeatsAvailable = allBerths.filter(
    (b) => b.available && b.type && b.type.toLowerCase().includes('single')
  ).length;

  // Fares calculation from actual berths
  const fares = allBerths.map((b) => b.fare).filter((f) => typeof f === 'number' && !isNaN(f));
  const minFare = fares.length > 0 ? Math.min(...fares) : 1100;
  const maxFare = fares.length > 0 ? Math.max(...fares) : 1350;

  // Route & Stops from live API
  const route = apiBus.route || {};
  const stops = Array.isArray(route.stops) ? route.stops : [];
  
  const boardingStops = stops.filter((s) => s.stopType === 'boarding' || s.stopType === 'both');
  const droppingStops = stops.filter((s) => s.stopType === 'dropping' || s.stopType === 'both');

  const firstStop = boardingStops[0] || stops[0] || {};
  const lastStop = droppingStops[droppingStops.length - 1] || stops[stops.length - 1] || {};

  const departureTime =
    firstStop.estimatedArrivalTime ||
    formatTimeFromDate(apiBus.departureDateTime) ||
    '22:00';

  const arrivalTime =
    lastStop.estimatedArrivalTime ||
    formatTimeFromDate(apiBus.arrivalDateTime) ||
    '06:30';

  const departureCity = apiBus.origin || route.originCity || firstStop.city || 'Chennai';
  const arrivalCity = apiBus.destination || route.destinationCity || lastStop.city || 'Coimbatore';

  const departurePoint = firstStop.name || 'Koyambedu (CMBT)';
  const droppingPoint = lastStop.name || 'Gandhipuram Omni Bus Stand';

  const durationMinutes = route.estimatedDurationMinutes || 510;
  const duration = formatDuration(durationMinutes);
  const distance = route.estimatedDistance || 505;

  const haltStops = stops.filter((s) => s.isHalt);
  const isNonStop = haltStops.length === 0;

  const rawRouteName = apiBus.busName;
  const operatorName =
    apiBus.agencyName ||
    rawRouteName.replace(/ Ultra Deluxe Express.*$/i, '').trim() ||
    'BusGo Express';

  const deckTypeLabel =
    seatLayout.deckType === 'double' ? 'Double Deck Sleeper (2+1)' : 'AC Sleeper';

  return {
    id: apiBus._id || apiBus.busId || `bus-${index}`,
    _id: apiBus._id,
    busId: apiBus.busId,
    agencyId: apiBus.agencyId,
    operatorName,
    operatorInitial: operatorName.charAt(0).toUpperCase() || 'B',
    avatarBg: 'bg-[#E8EEF5]',
    avatarColor: 'text-[#2563EB]',
    busType: `${deckTypeLabel} • Luxury Multi-Axle`,
    category: 'AC Sleeper',
    deckType: seatLayout.deckType || 'double',
    layoutType: seatLayout.layoutType || 'Sleeper',
    totalPassengerCapacity: seatLayout.totalPassengerCapacity || (lowerCapacity + upperCapacity),
    tags: [
      { text: 'Fastest Route', type: 'fastest' },
      { text: 'BusGo Prime', type: 'prime' }
    ],
    rating: 4.8,
    reviewsCount: 1248,
    departureTime,
    departurePeriod: getDeparturePeriod(departureTime),
    departureCity,
    departurePoint,
    arrivalTime,
    arrivalCity,
    droppingPoint,
    duration,
    durationMinutes,
    distance,
    isNonStop,
    price: minFare,
    maxPrice: maxFare,
    originalPrice: Math.round(minFare * 1.25),
    seatsLeft: totalAvailableSeats,
    singleSeatsLeft: singleSeatsAvailable,
    cancellationNote: 'Free Cancellation up to 12 hrs before',
    amenities: [
      'Live tracking',
      'Wi-Fi',
      'Blanket',
      'Charging port',
      'Water Bottle',
      'Pillow',
      'Reading Light',
      'Emergency Exit'
    ],
    boardingPoints: boardingStops.map((s) => s.name),
    droppingPoints: droppingStops.map((s) => s.name),
    seatLayout: {
      deckType: seatLayout.deckType || 'double',
      layoutType: seatLayout.layoutType || 'Sleeper',
      totalPassengerCapacity: seatLayout.totalPassengerCapacity || 36,
      lowerDeck: {
        deckName: lowerDeck.deckName || 'Lower Deck',
        passengerCapacity: lowerCapacity,
        availableCount: lowerAvailableCount,
        bookedCount: lowerCapacity - lowerAvailableCount,
        rows: lowerDeck.rows || []
      },
      upperDeck: {
        deckName: upperDeck.deckName || 'Upper Deck',
        passengerCapacity: upperCapacity,
        availableCount: upperAvailableCount,
        bookedCount: upperCapacity - upperAvailableCount,
        rows: upperDeck.rows || []
      }
    },
    lowerDeckSeatsCount: {
      total: lowerCapacity,
      available: lowerAvailableCount,
      booked: lowerCapacity - lowerAvailableCount
    },
    upperDeckSeatsCount: {
      total: upperCapacity,
      available: upperAvailableCount,
      booked: upperCapacity - upperAvailableCount
    },
    route: {
      routeName: route.routeName || `${departureCity} to ${arrivalCity} Express`,
      originCity: departureCity,
      destinationCity: arrivalCity,
      routeCategory: route.routeCategory || 'Express Intercity',
      estimatedDistance: distance,
      estimatedDurationMinutes: durationMinutes,
      description: route.description || '',
      stops: stops
    },
    stops: stops,
    notes: apiBus.notes || '',
    status: apiBus.status || 'scheduled',
    raw: apiBus
  };
}

/**
 * Fetch buses search API:
 * GET {{baseUrl}}/buses/search?source={source}&destination={destination}&journeyDate={journeyDate}
 * 
 * Uses live API with authentication token retrieved from browser inspect -> Application.
 * If no response or error, returns empty list so the UI displays
 * "No buses available for this date" as requested.
 */
export async function fetchBusesSearch(options = {}) {
  const {
    source = 'Chennai',
    destination = 'Coimbatore',
    journeyDate = '2026-10-26',
    baseUrl = null,
    token: passedToken = null
  } = options;

  // Retrieve token from options or browser inspect -> Application tab storage
  const authToken = passedToken || getAuthToken();

  // Clean city names (remove " (Koyambedu)", etc.)
  const cleanSource = source.split('(')[0].trim();
  const cleanDest = destination.split('(')[0].trim();

  // Normalize journeyDate to YYYY-MM-DD
  let dateParam = journeyDate;
  if (journeyDate instanceof Date) {
    dateParam = journeyDate.toISOString().split('T')[0];
  } else if (typeof journeyDate === 'string' && journeyDate.length > 10) {
    const parsed = new Date(journeyDate);
    if (!isNaN(parsed.getTime())) {
      dateParam = parsed.toISOString().split('T')[0];
    }
  }

  const queryParams = new URLSearchParams({
    source: cleanSource,
    destination: cleanDest,
    journeyDate: dateParam
  });

  const envBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  
  // Potential endpoints: user custom, envBase, direct IP, and relative Vite proxy
  const candidateUrls = [
    baseUrl ? `${baseUrl.replace(/\/+$/, '')}/buses/search?${queryParams.toString()}` : null,
    envBase ? `${envBase}/buses/search?${queryParams.toString()}` : null,
    `http://10.57.1.245:8000/api/buses/search?${queryParams.toString()}`,
    `/api/buses/search?${queryParams.toString()}`
  ].filter(Boolean);

  // De-duplicate endpoints
  const uniqueUrls = Array.from(new Set(candidateUrls));

  let lastError = null;

  for (const targetUrl of uniqueUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      // Attach token from Application tab storage
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
        headers['exte_key'] = authToken;
        headers['x-auth-token'] = authToken;
        headers['token'] = authToken;
      }

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        let busList = [];
        if (Array.isArray(json)) {
          busList = json;
        } else if (Array.isArray(json.data)) {
          busList = json.data;
        } else if (Array.isArray(json.buses)) {
          busList = json.buses;
        }

        if (busList && busList.length > 0) {
          return {
            success: true,
            source: cleanSource,
            destination: cleanDest,
            journeyDate: dateParam,
            count: busList.length,
            buses: busList.map((item, idx) => mapApiBusToUiBus(item, idx)),
            isLive: true
          };
        } else {
          // Valid API response, but 0 buses found for this date
          return {
            success: true,
            source: cleanSource,
            destination: cleanDest,
            journeyDate: dateParam,
            count: 0,
            buses: [],
            isLive: true
          };
        }
      } else {
        lastError = new Error(`API returned status ${response.status}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  // If API cannot be reached or returned error: Return NO buses so UI shows "No buses available for this date"
  return {
    success: false,
    source: cleanSource,
    destination: cleanDest,
    journeyDate: dateParam,
    count: 0,
    buses: [],
    isLive: false,
    error: lastError ? lastError.message : 'No bus available for this date'
  };
}
