// Defines the canonical violation types
export const VIOLATION_TYPES = {
  OVERSPEEDING: 'Overspeeding',
  RED_LIGHT: 'Red Light Jump',
  NO_HELMET: 'No Helmet',
  WRONG_LANE: 'Wrong Lane',
  OTHER: 'Other',
};

// --- Normalization Mappings ---
// Maps various string inputs to a canonical type.
// Keys are lowercase for case-insensitive matching.

const OVERSPEED_MAP = [
  'overspeeding',
  'over speed',
  'speeding',
  'speed violation',
];
const RED_LIGHT_MAP = [
  'red light jump',
  'signal jump',
  'rlv',
  'red light violation',
];
const NO_HELMET_MAP = ['no helmet', 'without helmet', 'helmet violation'];
const WRONG_LANE_MAP = ['wrong lane', 'lane violation', 'wrong side', 'illegal lane change'];

/**
 * Normalizes a raw violation type string into one of the
 * canonical types defined in VIOLATION_TYPES.
 * @param {string} rawType The raw string from the data source.
 * @returns {string} The canonical violation type.
 */
export function normalizeViolationType(rawType) {
  if (!rawType || typeof rawType !== 'string') {
    return VIOLATION_TYPES.OTHER;
  }

  const lowerType = rawType.toLowerCase().trim();

  if (OVERSPEED_MAP.includes(lowerType)) {
    return VIOLATION_TYPES.OVERSPEEDING;
  }
  if (RED_LIGHT_MAP.includes(lowerType)) {
    return VIOLATION_TYPES.RED_LIGHT;
  }
  if (NO_HELMET_MAP.includes(lowerType)) {
    return VIOLATION_TYPES.NO_HELMET;
  }
  if (WRONG_LANE_MAP.includes(lowerType)) {
    return VIOLATION_TYPES.WRONG_LANE;
  }

  // If it doesn't match, return the original (TitleCased) or 'Other'
  return (
    VIOLATION_TYPES[lowerType.toUpperCase().replace(' ', '_')] ||
    VIOLATION_TYPES.OTHER
  );
}