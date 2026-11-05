import {
  Wifi,
  Zap,
  Droplets,
  Lightbulb,
  Wind,
  ShieldAlert,
  Moon,
  BedDouble,
  Navigation,
  Video,
  AlertCircle,
  Utensils,
  Tv,
  Sparkles
} from 'lucide-react';

export const AMENITY_REGISTRY = {
  wifi: {
    key: 'wifi',
    label: 'Wi-Fi',
    fullLabel: '5G High-Speed Wi-Fi',
    icon: Wifi,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'High Speed'
  },
  chargingpoint: {
    key: 'chargingPoint',
    label: 'Charging point',
    fullLabel: '230V / USB Charging',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'Individual'
  },
  chargingport: {
    key: 'chargingPort',
    label: 'Charging port',
    fullLabel: '230V / USB Charging',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'Individual'
  },
  chargingsocket: {
    key: 'chargingSocket',
    label: 'Charging socket',
    fullLabel: '230V / USB Charging',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'Individual'
  },
  readinglight: {
    key: 'readingLight',
    label: 'Reading light',
    fullLabel: 'Individual Reading Light',
    icon: Lightbulb,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'Personal'
  },
  waterbottle: {
    key: 'waterBottle',
    label: 'Water bottle',
    fullLabel: 'Complimentary Water Bottle',
    icon: Droplets,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    badge: 'Complimentary'
  },
  mineralwater: {
    key: 'mineralWater',
    label: 'Mineral Water',
    fullLabel: 'Complimentary Mineral Water',
    icon: Droplets,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    badge: 'Complimentary'
  },
  airconditioning: {
    key: 'airConditioning',
    label: 'Air conditioning',
    fullLabel: 'Centralized Climate Control AC',
    icon: Wind,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badge: 'Climate Control'
  },
  ac: {
    key: 'ac',
    label: 'Air conditioning',
    fullLabel: 'Centralized Climate Control AC',
    icon: Wind,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badge: 'Climate Control'
  },
  emergencyexit: {
    key: 'emergencyExit',
    label: 'Emergency exit',
    fullLabel: 'Emergency Exit Door & Window',
    icon: ShieldAlert,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'Safety'
  },
  blanket: {
    key: 'blanket',
    label: 'Blanket',
    fullLabel: 'Fresh Sanitized Blanket',
    icon: Moon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'Sanitized'
  },
  pillow: {
    key: 'pillow',
    label: 'Pillow',
    fullLabel: 'Sanitized Comfort Pillow',
    icon: Moon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    badge: 'Sanitized'
  },
  blanketpillow: {
    key: 'blanketPillow',
    label: 'Blanket & Pillow',
    fullLabel: 'Sanitized Blanket & Pillow',
    icon: Moon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'Sanitized'
  },
  linen: {
    key: 'linen',
    label: 'Fresh Linen',
    fullLabel: 'Fresh Sanitized Linen',
    icon: BedDouble,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'Sanitized'
  },
  gps: {
    key: 'gps',
    label: 'Live tracking',
    fullLabel: 'Live GPS Tracking',
    icon: Navigation,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: 'Live GPS'
  },
  livetracking: {
    key: 'liveTracking',
    label: 'Live tracking',
    fullLabel: 'Live GPS Tracking',
    icon: Navigation,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: 'Live GPS'
  },
  livegpstracking: {
    key: 'liveGpsTracking',
    label: 'Live tracking',
    fullLabel: 'Live GPS Tracking',
    icon: Navigation,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: 'Live GPS'
  },
  cctv: {
    key: 'cctv',
    label: 'CCTV',
    fullLabel: 'CCTV 24x7 Surveillance',
    icon: Video,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 text-slate-700 border-slate-200',
    badge: 'Security'
  },
  cctvsurveillance: {
    key: 'cctvSurveillance',
    label: 'CCTV Surveillance',
    fullLabel: 'CCTV 24x7 Surveillance',
    icon: Video,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 text-slate-700 border-slate-200',
    badge: 'Security'
  },
  emergencysos: {
    key: 'emergencySos',
    label: 'Emergency SOS',
    fullLabel: 'Emergency SOS Button',
    icon: AlertCircle,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'Safety'
  },
  emergencysosbutton: {
    key: 'emergencySosButton',
    label: 'Emergency SOS Button',
    fullLabel: 'Emergency SOS Button',
    icon: AlertCircle,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'Safety'
  },
  snacks: {
    key: 'snacks',
    label: 'Snacks',
    fullLabel: 'Complimentary Travel Snacks',
    icon: Utensils,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
    badge: 'Complimentary'
  },
  moviescreen: {
    key: 'movieScreen',
    label: 'Movie Screen',
    fullLabel: 'Onboard Entertainment Screen',
    icon: Tv,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 text-violet-700 border-violet-200',
    badge: 'Entertainment'
  },
  tv: {
    key: 'tv',
    label: 'TV Screen',
    fullLabel: 'Onboard Entertainment Screen',
    icon: Tv,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 text-violet-700 border-violet-200',
    badge: 'Entertainment'
  }
};

/**
 * Normalizes any amenity key (camelCase, Title Case, lowercase) into standardized metadata.
 */
export const getAmenityMeta = (amenity) => {
  if (!amenity) return null;
  const str = String(amenity).trim();
  const normalizedKey = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (AMENITY_REGISTRY[normalizedKey]) {
    return AMENITY_REGISTRY[normalizedKey];
  }

  // Fallback: auto-format label from camelCase or snake_case
  const humanLabel = str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .trim()
    .replace(/^./, (l) => l.toUpperCase());

  return {
    key: normalizedKey,
    label: humanLabel,
    fullLabel: humanLabel,
    icon: Sparkles,
    color: 'text-[#0A6A69]',
    bgColor: 'bg-teal-50 text-teal-800 border-teal-200',
    badge: 'Amenity'
  };
};

/**
 * Standardize an array of raw amenity strings from backend
 * Returns array of display strings, e.g. ["Wi-Fi", "Charging point", ...]
 */
export const normalizeAmenitiesList = (rawList) => {
  if (!Array.isArray(rawList) || rawList.length === 0) return [];
  const seen = new Set();
  const result = [];

  rawList.forEach((item) => {
    const meta = getAmenityMeta(item);
    if (meta && !seen.has(meta.label.toLowerCase())) {
      seen.add(meta.label.toLowerCase());
      result.push(meta.label);
    }
  });

  return result;
};

