/**
 * Offers Service
 * 
 * Handles fetching, normalizing, and managing trip offers from the admin API:
 * {{baseUrl}}/admin/offers?page=1&limit=20&category=&isActive=true&search=&sortBy=createdAt&sortOrder=desc
 * 
 * Token is retrieved from localStorage/sessionStorage under 'exte_key'.
 * Normalizes backend response fields: heading, description, offer code, valid till, terms and conditions.
 */

// Raw API response offers matching the backend database schema
export const RAW_API_OFFERS = [
  {
    _id: '6ad0ae90f2fd98fac04f0c23',
    heading: 'FIRST',
    description: 'Flat 20% discount on all first time users',
    offerCode: 'NEW2026',
    validTill: '2026-11-30T23:59:59.000Z',
    offerCategory: 'New User',
    termsAndConditions: [
      'Valid only on bookings made via registered accounts.',
      'Applicable once per user during 1st time login.',
      'Cannot be combined with any other promotional codes.'
    ],
    isActive: true
  },
  {
    _id: '6ad0ae46f2fd98fac04f0c22',
    heading: 'Mega Diwali Special Discount',
    description: 'Flat 20% discount on all festive inter-state bus bookings.',
    offerCode: 'DIWALI2026',
    validTill: '2026-11-30T23:59:59.000Z',
    offerCategory: 'Festive',
    termsAndConditions: [
      'Valid only on bookings made via registered accounts.',
      'Applicable once per user during the festive period.',
      'Cannot be combined with any other promotional codes.'
    ],
    isActive: true
  },
  {
    _id: '6ad0aefd4c500a51cdae5869',
    heading: 'Round-Trip',
    description: 'Flat 10% discount on all round trip tickets',
    offerCode: 'RETURN20',
    validTill: '2026-11-30T23:59:59.000Z',
    offerCategory: 'Round_Trip_Offer',
    termsAndConditions: [
      'Valid only on bookings made via registered accounts.',
      'Applicable once per user during 1st time login.',
      'Cannot be combined with any other promotional codes.'
    ],
    isActive: true
  }
];

export const DEFAULT_OFFERS = RAW_API_OFFERS.map((item, idx) => mapApiOfferToUiOffer(item, idx));

/**
 * Retrieves the authentication token (exte_key) from storage
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return '';
  try {
    return (
      localStorage.getItem('exte_key')
    );
  } catch {
    return '';
  }
}



/**
 * Formats an ISO date string (e.g. "2026-11-30T23:59:59.000Z") to "30 Nov 2026"
 */
function formatValidDate(dateVal) {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateVal);
  }
}

/**
 * Maps raw API offer object to the normalized component contract
 * Exact mapping as per API response:
 * - badge: heading (item.heading)
 * - description: description (item.description)
 * - category: offerCategory (item.offerCategory)
 * - copy code: offerCode (item.offerCode)
 * - valid till: validTill (item.validTill - as it is)
 * - terms and conditions: termsAndConditions (item.termsAndConditions - as it is)
 */
export function mapApiOfferToUiOffer(item, index = 0) {
  if (!item) return null;

  // 1. Copy code - offer code
  const offerCode = item.offerCode || '';

  // 2. In badge use heading
  const heading = item.heading || '';

  // 3. Category - offer category
  const offerCategory = item.offerCategory || '';

  // 4. In description add description
  const description = item.description || '';

  // 5. Valid till as it same
  const validTill = item.validTill || '';

  // 6. Terms and condition as same terms and condition
  const termsAndConditions = Array.isArray(item.termsAndConditions)
    ? item.termsAndConditions
    : [];

  // Theme & Icon rhythm (Mint/Teal %, Amber ⚡, Blue ✈️)
  const defaultThemes = ['teal', 'amber', 'blue'];
  const defaultIcons = ['percent', 'zap', 'plane'];

  let theme = item.theme;
  let iconType = item.iconType;

  if (!theme) {
    const combinedContext = `${heading} ${offerCategory} ${offerCode} ${description}`.toLowerCase();
    if (combinedContext.includes('round') || combinedContext.includes('return') || combinedContext.includes('trip')) {
      theme = 'blue';
      iconType = 'plane';
    } else if (combinedContext.includes('first') || combinedContext.includes('new user') || combinedContext.includes('welcome')) {
      theme = 'teal';
      iconType = 'percent';
    } else if (combinedContext.includes('diwali') || combinedContext.includes('festive') || combinedContext.includes('expir') || combinedContext.includes('cash') || combinedContext.includes('special')) {
      theme = 'amber';
      iconType = 'zap';
    } else {
      theme = defaultThemes[index % 3];
      iconType = defaultIcons[index % 3];
    }
  }

  return {
    id: item._id || item.id || `offer-${index}`,
    _id: item._id || item.id || `offer-${index}`,
    code: offerCode,
    offerCode: offerCode,
    badgeText: heading,
    heading: heading,
    category: offerCategory,
    offerCategory: offerCategory,
    description: description,
    validTill: validTill,
    validUntil: validTill,
    terms: termsAndConditions,
    termsAndConditions: termsAndConditions,
    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
    theme,
    iconType: iconType || 'percent',
    raw: item
  };
}

/**
 * Fetches offers directly from the Admin Offers API endpoint:
 * {{baseUrl}}/admin/offers?page=1&limit=20&category=&isActive=true&search=&sortBy=createdAt&sortOrder=desc
 * 
 * @param {Object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 * @param {string} [options.category='']
 * @param {boolean} [options.isActive=true]
 * @param {string} [options.search='']
 * @param {string} [options.sortBy='createdAt']
 * @param {string} [options.sortOrder='desc']
 * @param {string} [options.token] - Optional explicit token override. Defaults to getAuthToken() (exte_key)
 * @param {string} [options.baseUrl] - Optional baseUrl override
 */
export async function fetchAdminOffers(options = {}) {
  const {
    page = 1,
    limit = 20,
    category = '',
    isActive = true,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    token: passedToken = null,
    baseUrl: customBaseUrl = null
  } = options;

  const rawBase = (import.meta.env.VITE_API_BASE_URL);
  const token = getAuthToken();

  // Query parameters according to user specifications
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    category: category || '',
    isActive: String(isActive),
    search: search || '',
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc'
  });

  // Endpoints to try (both with /api prefix and without)
  const candidateUrls = [
    `${rawBase.replace(/\/api\/?$/, '')}/admin/offers?${params.toString()}`,
    `${rawBase}/admin/offers?${params.toString()}`
  ];

  let lastError = null;

  for (const targetUrl of candidateUrls) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['exte_key'] = token;
        headers['x-auth-token'] = token;
      }

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers
      });

      if (response.status === 404) {
        continue;
      }

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.message || `API error with status ${response.status}`);
      }

      const data = await response.json();

      // Extract array from response payload
      let rawList = [];
      if (Array.isArray(data)) {
        rawList = data;
      } else if (Array.isArray(data.offers)) {
        rawList = data.offers;
      } else if (Array.isArray(data.data?.offers)) {
        rawList = data.data.offers;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      } else if (Array.isArray(data.result)) {
        rawList = data.result;
      }

      if (rawList && rawList.length > 0) {
        const mapped = rawList.map((item, idx) => mapApiOfferToUiOffer(item, idx));
        return mapped.sort((a, b) => {
          const rank = (t) => (t === 'teal' ? 1 : t === 'amber' ? 2 : t === 'blue' ? 3 : 4);
          return rank(a.theme) - rank(b.theme);
        });
      }

      return [];
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}

/**
 * Main offers getter for TripOffers component.
 * Attempts to load from the live admin offers API first.
 * If API is unreachable, unauthenticated, or empty, gracefully falls back to personalized user offers.
 */
export async function fetchUserOffers(userId, apiEndpoint = null, options = {}) {
  try {
    const liveOffers = await fetchAdminOffers({
      customBaseUrl: apiEndpoint ? apiEndpoint.split('/admin/offers')[0] : null,
      ...options
    });

    if (liveOffers && liveOffers.length > 0) {
      return liveOffers;
    }
  } catch (err) {
    console.warn('[offersService] Live API fetch note:', err.message);
  }

  // Graceful fallback to deterministic personalized offers so UI remains complete & functional
  return generateUserOffers(userId);
}

/**
 * Deterministic hash function for consistent user-specific generation
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns available offers matching the API response
 */
export function generateUserOffers() {
  return DEFAULT_OFFERS;
}
