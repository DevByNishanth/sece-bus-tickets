import { normalizeAmenitiesList } from '../Utils/amenityConfig';

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

    // 5. Environment variable VITE_AUTH_TOKEN
    if (import.meta.env.VITE_AUTH_TOKEN) {
      return import.meta.env.VITE_AUTH_TOKEN.trim().replace(/^Bearer\s+/i, '');
    }
  } catch (err) {
    console.warn('[busService] Token retrieval note:', err);
  }
  return '';
}

/**
 * Resolves the primary API base URL.
 * Supports:
 * - customBase if provided
 * - import.meta.env.VITE_API_BASE_URL
 * - import.meta.env.VITE_API_URL
 * - '/api' (default relative endpoint via Vite proxy)
 */
export function getApiBaseUrl(customBase = null) {
  if (customBase && typeof customBase === 'string' && customBase.trim()) {
    return customBase.trim().replace(/\/+$/, '');
  }
  const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envBase && typeof envBase === 'string' && envBase.trim()) {
    return envBase.trim().replace(/\/+$/, '');
  }
  return '/api';
}

/**
 * Returns prioritized candidate base URLs for API requests.
 * Uses the configured environment base URL (VITE_API_BASE_URL) from .env.
 */
export function getCandidateBaseUrls(customBase = null) {
  const primary = getApiBaseUrl(customBase);
  return [primary];
}

/**
 * Retrieves the user profile from browser storage:
 * Checks localStorage, sessionStorage, or user objects.
 * Returns { name, email, phone, age, gender }
 */
export function getUserProfile() {
  if (typeof window === 'undefined') return null;
  const candidateKeys = [
    'user',
    'userData',
    'userProfile',
    'profile',
    'currentUser',
    'authUser',
    'auth',
    'login_data',
    'user_info',
    'passenger_profile'
  ];

  for (const key of candidateKeys) {
    try {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        const parsed =
          typeof raw === 'string' && (raw.startsWith('{') || raw.startsWith('['))
            ? JSON.parse(raw)
            : null;
        if (parsed) {
          const u = parsed.user || parsed.data || parsed.profile || parsed;
          const fullName =
            u.fullName ||
            u.name ||
            (u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : '');
          const email = u.email || u.emailAddress || u.contactEmail || '';
          const phone = u.phone || u.mobile || u.phoneNumber || u.contactPhone || '';
          const age = u.age || u.userAge || '';
          const gender = u.gender || '';

          if (fullName || email || phone) {
            return {
              name: fullName || '',
              fullName: fullName || '',
              email: email || '',
              phone: phone ? String(phone).replace(/\D/g, '').slice(-10) : '',
              age: age ? String(age) : '',
              gender: (gender || 'male').toLowerCase() === 'female' ? 'female' : 'male'
            };
          }
        }
      }
    } catch {
      // not JSON
    }
  }

  // Also check direct individual keys
  const directName = localStorage.getItem('userName') || localStorage.getItem('fullName') || '';
  const directEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || '';
  const directPhone = localStorage.getItem('userPhone') || localStorage.getItem('phone') || '';
  const directAge = localStorage.getItem('userAge') || localStorage.getItem('age') || '';
  const directGender = localStorage.getItem('userGender') || localStorage.getItem('gender') || '';

  if (directName || directEmail || directPhone) {
    return {
      name: directName || '',
      fullName: directName || '',
      email: directEmail || '',
      phone: directPhone ? String(directPhone).replace(/\D/g, '').slice(-10) : '',
      age: directAge ? String(directAge) : '',
      gender: directGender ? (directGender.toLowerCase() === 'female' ? 'female' : 'male') : 'male'
    };
  }

  // Default fallback profile matching the Navbar profile pill
  return {
    name: 'Alexandre M.',
    fullName: 'Alexandre M.',
    email: 'alexandre.m@example.com',
    phone: '9876543210',
    age: '26',
    gender: 'male'
  };
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
 * Normalizes dynamic seat layout from backend API:
 * Supports:
 * 1. Flat array of seats (e.g. 40 seater seats [S1..S40] with deck="lower", or double decker with deck="upper")
 * 2. Pre-structured object with lowerDeck and upperDeck
 * 3. Dynamic deckType calculation: 'single' vs 'double'
 * 4. Dynamic row assignment (4 for 2+2 seater, 3 for 2+1 sleeper)
 */
export function normalizeSeatLayout(rawLayout, apiBus = {}) {
  const deckConfig = String(apiBus.deckConfiguration || apiBus.deckType || '').toLowerCase();
  const busTypeStr = String(apiBus.busType || apiBus.category || '').toLowerCase();
  const defaultFare = Number(apiBus.fare) || Number(apiBus.price) || 650;

  // 1. Array of seats returned from backend
  if (Array.isArray(rawLayout) && rawLayout.length > 0) {
    const hasExplicitUpper = rawLayout.some(
      (s) => String(s.deck || '').toLowerCase() === 'upper' || String(s.seatNumber || '').toUpperCase().startsWith('U')
    );

    const isSingleDeck = deckConfig === 'single' || (!hasExplicitUpper && deckConfig !== 'double');

    // Filter lower and upper deck items
    const lowerItems = rawLayout.filter((s) => {
      if (isSingleDeck) return true;
      const d = String(s.deck || '').toLowerCase();
      const num = String(s.seatNumber || '').toUpperCase();
      return d === 'lower' || (!d && !num.startsWith('U'));
    });

    const upperItems = isSingleDeck
      ? []
      : rawLayout.filter((s) => {
          const d = String(s.deck || '').toLowerCase();
          const num = String(s.seatNumber || '').toUpperCase();
          return d === 'upper' || num.startsWith('U');
        });

    // Detect seater vs sleeper
    const hasSleeperSeats = rawLayout.some((s) => {
      const t = String(s.seatType || s.type || '').toLowerCase();
      return t.includes('sleeper') || t.includes('berth');
    });
    const hasSeaterSeats = rawLayout.some((s) => {
      const t = String(s.seatType || s.type || '').toLowerCase();
      return t.includes('seat') && !t.includes('sleeper');
    });

    const isSleeperBus = busTypeStr.includes('sleeper') || (hasSleeperSeats && !hasSeaterSeats);
    const isSeaterBus = busTypeStr.includes('seater') || (hasSeaterSeats && !hasSleeperSeats);

    let layoutType = 'Seater';
    if (isSleeperBus && isSeaterBus) layoutType = 'Seater / Sleeper';
    else if (isSleeperBus) layoutType = 'Sleeper';
    else if (isSeaterBus) layoutType = 'Seater';

    // Format individual seat
    const formatSeat = (s, defaultType, deckName) => {
      const num = s.seatNumber || s.id || '';
      const id = s.seatId || (num ? `seat-${num}` : `seat-${Math.random()}`);
      const st = String(s.status || '').toLowerCase();
      const isAvailable = st === 'available' || st === '';
      const seatType = s.seatType || s.type || defaultType;

      return {
        seatNumber: num,
        seatId: id,
        id: id,
        type: seatType,
        fare: Number(s.fare) || defaultFare,
        status: isAvailable ? (s.gender ? String(s.gender).toLowerCase() : 'available') : st,
        available: isAvailable,
        gender: s.gender || s.bookedGender || null,
        deck: deckName,
        raw: s
      };
    };

    // Group into rows
    const chunkIntoRows = (items, defaultSeatType, seatsPerRow, deckName) => {
      const hasExplicitRow = items.some((s) => s.row !== undefined || s.rowNumber !== undefined);
      if (hasExplicitRow) {
        const rowMap = new Map();
        items.forEach((s) => {
          const rNum = s.row !== undefined ? s.row : (s.rowNumber !== undefined ? s.rowNumber : 1);
          if (!rowMap.has(rNum)) rowMap.set(rNum, []);
          rowMap.get(rNum).push(formatSeat(s, defaultSeatType, deckName));
        });

        return Array.from(rowMap.entries())
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([rNum, seats]) => ({
            rowNumber: Number(rNum),
            rowLabel: `Row ${rNum}`,
            seats
          }));
      }

      const rows = [];
      let rowNum = 1;
      for (let i = 0; i < items.length; i += seatsPerRow) {
        const slice = items.slice(i, i + seatsPerRow);
        rows.push({
          rowNumber: rowNum,
          rowLabel: `Row ${rowNum}`,
          seats: slice.map((s) => formatSeat(s, defaultSeatType, deckName))
        });
        rowNum++;
      }
      return rows;
    };

    const lowerSeatsPerRow = isSleeperBus && !isSeaterBus ? 3 : 4;
    const upperSeatsPerRow = 3;

    const lowerRows = chunkIntoRows(
      lowerItems,
      isSleeperBus && !isSeaterBus ? 'Double Sleeper (Window)' : 'Window Seater',
      lowerSeatsPerRow,
      'lower'
    );

    const upperRows = isSingleDeck
      ? []
      : chunkIntoRows(upperItems, 'Single Sleeper (Window)', upperSeatsPerRow, 'upper');

    const lowerAvailableCount = lowerItems.filter((s) => String(s.status || '').toUpperCase() === 'AVAILABLE' || !s.status).length;
    const upperAvailableCount = upperItems.filter((s) => String(s.status || '').toUpperCase() === 'AVAILABLE' || !s.status).length;

    return {
      deckType: isSingleDeck ? 'single' : 'double',
      layoutType,
      totalPassengerCapacity: rawLayout.length,
      lowerDeck: {
        deckName: isSingleDeck ? (isSeaterBus ? 'SEATER DECK' : 'MAIN DECK') : 'LOWER DECK',
        passengerCapacity: lowerItems.length,
        availableCount: lowerAvailableCount,
        bookedCount: lowerItems.length - lowerAvailableCount,
        rows: lowerRows
      },
      ...(isSingleDeck
        ? {}
        : {
            upperDeck: {
              deckName: 'UPPER DECK',
              passengerCapacity: upperItems.length,
              availableCount: upperAvailableCount,
              bookedCount: upperItems.length - upperAvailableCount,
              rows: upperRows
            }
          })
    };
  }

  // 2. Pre-structured object
  if (rawLayout && typeof rawLayout === 'object' && (rawLayout.lowerDeck || rawLayout.rows)) {
    const isSingleDeck =
      deckConfig === 'single' ||
      rawLayout.deckType === 'single' ||
      (!rawLayout.upperDeck?.rows?.length && !rawLayout.upperDeck?.passengerCapacity);

    return {
      ...rawLayout,
      deckType: isSingleDeck ? 'single' : 'double',
      ...(isSingleDeck ? { upperDeck: null } : {})
    };
  }

  // 3. Fallback when seatLayout is missing
  const isSingleDeck = deckConfig === 'single' || !deckConfig.includes('double');
  const cap = Number(apiBus.totalSeats) || 40;
  const avail = apiBus.availableSeats !== undefined ? Number(apiBus.availableSeats) : cap;

  return {
    deckType: isSingleDeck ? 'single' : 'double',
    layoutType: busTypeStr.includes('seater') ? 'Seater' : 'Sleeper',
    totalPassengerCapacity: cap,
    lowerDeck: {
      deckName: isSingleDeck ? 'SEATER DECK' : 'LOWER DECK',
      passengerCapacity: cap,
      availableCount: avail,
      bookedCount: cap - avail,
      rows: []
    },
    ...(isSingleDeck
      ? {}
      : {
          upperDeck: {
            deckName: 'UPPER DECK',
            passengerCapacity: 18,
            availableCount: 18,
            bookedCount: 0,
            rows: []
          }
        })
  };
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

  const normalizedLayout = normalizeSeatLayout(apiBus.seatLayout, apiBus);
  const isSingleDeck = normalizedLayout.deckType === 'single';
  const lowerDeck = normalizedLayout.lowerDeck;
  const upperDeck = isSingleDeck ? null : normalizedLayout.upperDeck;

  // Collect all berths and seats from both decks
  const lowerBerths = (lowerDeck?.rows || []).flatMap((r) => r.seats || r.berths || []);
  const upperBerths = (upperDeck?.rows || []).flatMap((r) => r.seats || r.berths || []);
  const allBerths = [...lowerBerths, ...upperBerths];

  // Live seat counts and statistics
  const lowerCapacity = lowerDeck?.passengerCapacity || (lowerBerths.length > 0 ? lowerBerths.length : 40);
  const upperCapacity = isSingleDeck ? 0 : (upperDeck?.passengerCapacity || (upperBerths.length > 0 ? upperBerths.length : 0));

  const lowerAvailableCount = lowerDeck?.availableCount !== undefined
    ? lowerDeck.availableCount
    : lowerBerths.filter((b) => b.available !== false).length;
  const upperAvailableCount = isSingleDeck
    ? 0
    : (upperDeck?.availableCount !== undefined ? upperDeck.availableCount : upperBerths.filter((b) => b.available !== false).length);
  const totalAvailableSeats = apiBus.availableSeats !== undefined
    ? Number(apiBus.availableSeats)
    : (lowerAvailableCount + upperAvailableCount);

  const singleSeatsAvailable = allBerths.filter(
    (b) => b.available !== false && b.type && b.type.toLowerCase().includes('single')
  ).length;

  // Fares calculation from actual berths / seats
  const fares = allBerths.map((b) => b.fare).filter((f) => typeof f === 'number' && !isNaN(f));
  const minFare = fares.length > 0 ? Math.min(...fares) : (apiBus.fare || apiBus.price || 650);
  const maxFare = fares.length > 0 ? Math.max(...fares) : minFare;

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
    apiBus.operatorName ||
    apiBus.agencyName ||
    (rawRouteName ? rawRouteName.replace(/ Ultra Deluxe Express.*$/i, '').trim() : '') ||
    'BusGo Express';

  const layoutTypeStr = normalizedLayout.layoutType || 'Seater';
  const deckTypeLabel = isSingleDeck ? layoutTypeStr : `Double Deck ${layoutTypeStr}`;

  return {
    id: apiBus._id || apiBus.busId || `bus-${index}`,
    _id: apiBus._id,
    busId: apiBus.busId,
    agencyId: apiBus.agencyId,
    operatorName,
    operatorInitial: operatorName.charAt(0).toUpperCase() || 'B',
    avatarBg: 'bg-[#E8EEF5]',
    avatarColor: 'text-[#2563EB]',
    busType: apiBus.busType || `${deckTypeLabel} • Luxury Multi-Axle`,
    category: layoutTypeStr,
    deckType: isSingleDeck ? 'single' : 'double',
    layoutType: layoutTypeStr,
    totalPassengerCapacity: normalizedLayout.totalPassengerCapacity || (lowerCapacity + upperCapacity),
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
    amenities: Array.isArray(apiBus.amenities) && apiBus.amenities.length > 0
      ? normalizeAmenitiesList(apiBus.amenities)
      : [
          'Live tracking',
          'Wi-Fi',
          'Blanket',
          'Charging port',
          'Water Bottle',
          'Pillow',
          'Reading Light',
          'Emergency Exit'
        ],
    rawAmenities: Array.isArray(apiBus.amenities) ? apiBus.amenities : [],
    boardingPoints: boardingStops.map((s) => s.name),
    droppingPoints: droppingStops.map((s) => s.name),
    seatLayout: normalizedLayout,
    lowerDeckSeatsCount: {
      total: lowerCapacity,
      available: lowerAvailableCount,
      booked: lowerCapacity - lowerAvailableCount
    },
    ...(isSingleDeck ? {} : {
      upperDeckSeatsCount: {
        total: upperCapacity,
        available: upperAvailableCount,
        booked: upperCapacity - upperAvailableCount
      }
    }),
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
    commission: apiBus.commission !== undefined ? Number(apiBus.commission) : (apiBus.agentCommission !== undefined ? Number(apiBus.agentCommission) : 10),
    gst: apiBus.gst !== undefined ? Number(apiBus.gst) : (apiBus.tax !== undefined ? Number(apiBus.tax) : null),
    gstPercentage: apiBus.gstPercentage !== undefined ? Number(apiBus.gstPercentage) : (apiBus.taxPercentage !== undefined ? Number(apiBus.taxPercentage) : null),
    raw: apiBus
  };
}

/**
 * Fetch buses search API:
 * GET {{baseUrl}}/buses/search?source={source}&destination={destination}&journeyDate={journeyDate}
 * 
 * Uses live API with authentication token retrieved from browser inspect -> Application.
 * Queries the base URL configured via VITE_API_BASE_URL (or customBase).
 */
export async function fetchBusesSearch({
  source = 'Chennai',
  origin = null,
  destination = 'Coimbatore',
  journeyDate = '2026-10-26',
  passengers = 1,
  baseUrl = null,
  token = getAuthToken()
} = {}) {
  const cleanSource = typeof (origin || source) === 'string' ? (origin || source).split('(')[0].trim() : 'Chennai';
  const cleanDest = typeof destination === 'string' ? destination.split('(')[0].trim() : 'Coimbatore';
  let dateParam = journeyDate;
  if (journeyDate instanceof Date) {
    dateParam = journeyDate.toISOString().split('T')[0];
  } else if (typeof journeyDate === 'string' && journeyDate.length > 10) {
    const parsed = new Date(journeyDate);
    if (!isNaN(parsed.getTime())) {
      dateParam = parsed.toISOString().split('T')[0];
    }
  }

  const queryParams = new URLSearchParams();
  queryParams.append('source', cleanSource);
  queryParams.append('origin', cleanSource);
  queryParams.append('destination', cleanDest);
  queryParams.append('journeyDate', dateParam);
  if (passengers !== undefined && passengers !== null) {
    queryParams.append('passengers', String(passengers));
  }

  const candidateBases = getCandidateBaseUrls(baseUrl);
  let lastError = null;

  for (const base of candidateBases) {
    const targetUrl = `${base}/buses/search?${queryParams.toString()}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          lastError = new Error(errData.message || `Endpoint not found at ${base}`);
          continue;
        }
        throw new Error(errData.message || `API returned status ${response.status}`);
      }

      const data = await response.json();
      const busList = Array.isArray(data)
        ? data
        : (Array.isArray(data.data) ? data.data : (Array.isArray(data.buses) ? data.buses : []));

      return {
        success: true,
        source: cleanSource,
        destination: cleanDest,
        journeyDate: dateParam,
        count: busList.length,
        buses: busList.map((item, idx) => mapApiBusToUiBus(item, idx)),
        isLive: true
      };
    } catch (error) {
      lastError = error;
      // Network failure, timeout, or CORS block on this candidate -> try next
      continue;
    }
  }

  console.warn('[busService] Unable to connect to bus search server:', lastError?.message || 'Server unreachable');

  return {
    success: false,
    source: cleanSource,
    destination: cleanDest,
    journeyDate: dateParam,
    count: 0,
    buses: [],
    isLive: false,
    error: lastError ? (lastError.name === 'AbortError' ? 'Connection timed out' : lastError.message) : 'Unable to connect to bus search server'
  };
}

/**
 * Hold Seats API
 * POST {{baseUrl}}/bookings/hold-seats
 * 
 * Payload:
 * {
 *   "busId": "6adb0a1474060137dbb0aa97",
 *   "journeyDate": "2026-10-27",
 *   "seatNumbers": ["L3"]
 * }
 */
export async function holdSeatsBooking({
  busId,
  journeyDate,
  seatNumbers,
  baseUrl = null,
  token = getAuthToken()
}) {
  let dateParam = journeyDate;
  if (journeyDate instanceof Date) {
    dateParam = journeyDate.toISOString().split('T')[0];
  } else if (typeof journeyDate === 'string' && journeyDate.length > 10) {
    const parsed = new Date(journeyDate);
    if (!isNaN(parsed.getTime())) {
      dateParam = parsed.toISOString().split('T')[0];
    }
  } else if (!dateParam) {
    dateParam = new Date().toISOString().split('T')[0];
  }

  const seats = Array.isArray(seatNumbers) ? seatNumbers : [seatNumbers];
  const candidateBases = getCandidateBaseUrls(baseUrl);
  let lastError = null;

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(`${base}/bookings/hold-seats`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          busId: String(busId),
          journeyDate: String(dateParam),
          seatNumbers: seats
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        return {
          success: false,
          statusCode: response.status,
          message: data?.message || (response.status === 409
            ? `Seat(s) ${seats.join(', ')} are currently held by another passenger. Please select alternative seats.`
            : `Failed to hold seats (Status ${response.status})`),
          conflictedSeats: data?.conflictedSeats || (response.status === 409 ? seats : []),
          data: data?.data
        };
      }

      return {
        success: true,
        statusCode: response.status,
        message: data.message || 'Seats held successfully for 10 minutes',
        data: data.data
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    statusCode: 0,
    message: lastError?.message || 'Unable to connect to reservation server',
    conflictedSeats: []
  };
}

/**
 * Fetch fresh bus seat layout to check updated seat availability
 */
export async function fetchBusSeatLayout({
  busId,
  journeyDate,
  source = 'Chennai',
  destination = 'Coimbatore',
  baseUrl = null,
  token = getAuthToken()
}) {
  const candidateBases = getCandidateBaseUrls(baseUrl);

  // 1. Try direct bus endpoint: /buses/:busId
  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(`${base}/buses/${busId}`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const rawBus = data?.data || data?.bus || data;
        if (rawBus && (rawBus.seatLayout || rawBus._id)) {
          return mapApiBusToUiBus(rawBus);
        }
      }
    } catch {
      continue;
    }
  }

  // 2. Fallback: Search API to get updated bus seat layout
  try {
    const searchRes = await fetchBusesSearch({
      source,
      destination,
      journeyDate,
      baseUrl,
      token
    });

    if (searchRes.success && Array.isArray(searchRes.buses)) {
      return searchRes.buses.find(
        (b) => String(b._id || b.busId || b.id) === String(busId)
      ) || null;
    }
  } catch (error) {
    console.warn('[busService] Fetch Bus Seat Layout Error:', error);
  }

  return null;
}

/**
 * Create Booking API
 * POST {{baseUrl}}/bookings
 * 
 * Payload:
 * {
 *   "busId": "6adb0a1474060137dbb0aa97",
 *   "journeyDate": "2026-10-27",
 *   "seatNumbers": ["L1"],
 *   "passengers": [
 *     {
 *       "name": "Test Passenger",
 *       "age": 28,
 *       "gender": "female"
 *     }
 *   ],
 *   "boardingPointId": "6adb0a1574060137dbb0aad0",
 *   "droppingPointId": "6adb0a1574060137dbb0aad8"
 * }
 */
export async function createBooking({
  busId,
  journeyDate,
  seatNumbers,
  passengers,
  boardingPointId,
  droppingPointId,
  baseUrl = null,
  token = getAuthToken()
}) {
  let dateParam = journeyDate;
  if (journeyDate instanceof Date) {
    dateParam = journeyDate.toISOString().split('T')[0];
  } else if (typeof journeyDate === 'string' && journeyDate.length > 10) {
    const parsed = new Date(journeyDate);
    if (!isNaN(parsed.getTime())) {
      dateParam = parsed.toISOString().split('T')[0];
    }
  } else if (!dateParam) {
    dateParam = new Date().toISOString().split('T')[0];
  }

  const formattedPassengers = (passengers || []).map((p, idx) => ({
    name: (p.name || '').trim() || `Passenger ${idx + 1}`,
    age: parseInt(p.age, 10) || 28,
    gender: (p.gender || 'female').toLowerCase()
  }));

  const candidateBases = getCandidateBaseUrls(baseUrl);
  let lastError = null;

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(`${base}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          busId: String(busId),
          journeyDate: String(dateParam),
          seatNumbers: Array.isArray(seatNumbers) ? seatNumbers : [seatNumbers],
          passengers: formattedPassengers,
          boardingPointId: String(boardingPointId),
          droppingPointId: String(droppingPointId)
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Failed to create booking (Status ${response.status})`);
      }

      return {
        success: true,
        message: data.message || 'Booking created successfully',
        data: data.data || data
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unable to connect to booking server',
    data: null
  };
}

/**
 * Checkout Booking API (Combined Booking & PayU Order)
 * POST {{baseUrl}}/bookings/checkout
 *
 * Payload:
 * {
 *   "busId": "...",
 *   "journeyDate": "YYYY-MM-DD",
 *   "passengerDetails": [{ "fullName": "...", "age": 28, "gender": "Male", "seatId": "U17" }],
 *   "contactEmail": "...",
 *   "contactPhone": "...",
 *   "boardingPointId": "...",
 *   "droppingPointId": "...",
 *   "amount": 1250,
 *   "paymentMethod": "UPI",
 *   "upiType": "checkout"
 * }
 */
export async function checkoutBooking({
  busId,
  journeyDate,
  passengerDetails,
  contactEmail,
  contactPhone,
  boardingPointId,
  droppingPointId,
  amount,
  paymentMethod = 'UPI',
  upiType = 'checkout',
  baseUrl = null,
  token = getAuthToken()
}) {
  const candidateBases = getCandidateBaseUrls(baseUrl);
  let lastError = null;

  const finalAmount =
    amount !== undefined && amount !== null && !isNaN(Number(amount))
      ? Number(amount)
      : (amount || 0);

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(`${base}/bookings/checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          busId: String(busId),
          journeyDate: String(journeyDate),
          passengerDetails,
          contactEmail,
          contactPhone,
          boardingPointId: String(boardingPointId),
          droppingPointId: String(droppingPointId),
          amount: finalAmount,
          paymentMethod,
          upiType
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Checkout failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unable to connect to checkout server',
    data: null
  };
}

/**
 * Create PayU Payment Order API
 * POST {{baseUrl}}/payments/create-order
 * 
 * Payload:
 * {
 *   "bookingId": "6ae1c1ade86786338825fb84"
 * }
 */
export async function createPaymentOrder({
  bookingId,
  baseUrl = null,
  token = getAuthToken()
}) {
  const candidateBases = getCandidateBaseUrls(baseUrl);
  let lastError = null;

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(`${base}/payments/create-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ bookingId: String(bookingId) }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment initiation failed');
      }

      return data;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unable to connect to payment server'
  };
}

/**
 * Render / Redirect directly to PayU Hosted Checkout Page
 * Automatically creates and submits an HTML form to PayU's payment gateway URL,
 * including all parameters from payuParams both in the URL and form inputs.
 */
export function redirectToPayUCheckout(paymentData) {
  if (!paymentData) return false;

  const targetBaseUrl =
    paymentData.action ||
    paymentData.checkoutUrl ||
    paymentData.paymentUrl ||
    (import.meta.env.VITE_PAYMENT && import.meta.env.VITE_PAYMENT !== 'mock'
      ? import.meta.env.VITE_PAYMENT
      : null) ||
    'https://test.payu.in/_payment';

  const payuParams = paymentData.payuParams || paymentData.params || paymentData;

  const queryParams = new URLSearchParams();
  if (payuParams && typeof payuParams === 'object') {
    Object.entries(payuParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && typeof value !== 'object') {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const separator = targetBaseUrl.includes('?') ? '&' : '?';
  const fullUrlWithParams = queryString ? `${targetBaseUrl}${separator}${queryString}` : targetBaseUrl;

  console.log('[PayU Checkout] Navigating to:', fullUrlWithParams);

  if (payuParams && typeof payuParams === 'object' && Object.keys(payuParams).length > 0) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = fullUrlWithParams;
    form.name = 'payuCheckoutForm';
    form.style.display = 'none';

    Object.entries(payuParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && typeof value !== 'object') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
    return true;
  }

  if (fullUrlWithParams) {
    window.location.href = fullUrlWithParams;
    return true;
  }

  return false;
}

/**
 * Fetch Booking Details API
 * GET {{baseUrl}}/bookings/:bookingId
 */
export async function fetchBookingDetails(params) {
  const bookingId = typeof params === 'object' && params !== null ? params.bookingId : params;
  const customBase = typeof params === 'object' && params !== null ? params.baseUrl : null;
  const token = (typeof params === 'object' && params?.token) || getAuthToken();

  if (!bookingId) {
    return {
      success: false,
      message: 'Booking ID is required',
      data: null
    };
  }

  const candidateBases = getCandidateBaseUrls(customBase);
  let lastError = null;

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${base}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch booking details (Status ${response.status})`);
      }

      return {
        success: true,
        data: data.data || data.booking || data
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unable to connect to booking server',
    data: null
  };
}

/**
 * Fetch Payment Transaction Details API
 * GET {{baseUrl}}/payments/transaction/:txnid
 */
export async function fetchPaymentDetails(params) {
  const txnid = typeof params === 'object' && params !== null ? params.txnid : params;
  const customBase = typeof params === 'object' && params !== null ? params.baseUrl : null;
  const token = (typeof params === 'object' && params?.token) || getAuthToken();

  if (!txnid) {
    return {
      success: false,
      message: 'Transaction ID is required',
      data: null
    };
  }

  const candidateBases = getCandidateBaseUrls(customBase);
  let lastError = null;

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${base}/payments/transaction/${txnid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch payment details (Status ${response.status})`);
      }

      return {
        success: true,
        data: data.data || data.transaction || data.payment || data
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unable to connect to payment server',
    data: null
  };
}

/**
 * Fetch User Bookings API
 * GET {{baseUrl}}/bookings/my-bookings
 */
export async function fetchMyBookings(params = {}) {
  const customBase = params?.baseUrl || null;
  const token = params?.token || getAuthToken();

  const candidateBases = getCandidateBaseUrls(customBase);
  let lastError = null;

  for (const base of candidateBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${base}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch bookings (Status ${response.status})`);
      }

      return {
        success: true,
        data: Array.isArray(data.data) ? data.data : (data.bookings || [])
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    success: false,
    message: lastError?.message || 'Unable to connect to bookings server',
    data: []
  };
}




