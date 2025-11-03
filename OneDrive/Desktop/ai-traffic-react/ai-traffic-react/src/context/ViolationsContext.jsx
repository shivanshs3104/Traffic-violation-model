import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { normalizeViolationType } from '../lib/normalize';
import { DEFAULT_FINE } from '../lib/constants';

// --- Configuration ---
const JSON_DATA_URL = '/data/violations.json';
// VITE_API_URL can be set in a .env file
const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_INTERVAL = 5000; // 5 seconds

// --- Helper Functions ---

/**
 * Maps raw data (from JSON or API) to our app's data shape.
 * This makes the app resilient to changes in the data source.
 */
const mapRawDataToViolation = (raw) => {
  const normalizedType = normalizeViolationType(raw.violation || raw.type);
  const timestamp = raw.timestamp || raw.date || new Date().toISOString();
  
  return {
    id: raw.id,
    name: raw.name || 'N/A',
    vehicle: raw.license_plate || raw.vehicle_no || 'N/A',
    type: normalizedType,
    area: raw.area || 'Unknown Area',
    date: timestamp,
    fine: raw.fine || DEFAULT_FINE,
    status: raw.status || 'Pending', // Default to 'Pending'
    speed: raw.speed || null,
    camera: raw.camera || null,
    proof: {
      image: raw.image || (raw.proof ? raw.proof.image : null),
      plate_crop: raw.plate_crop || (raw.proof ? raw.proof.plate_crop : null),
    },
  };
};

/**
 * Calculates summary statistics from the list of violations.
 */
const calculateSummaries = (violations) => {
  let paidSum = 0;
  let dueSum = 0;
  let pendingCount = 0;

  violations.forEach((v) => {
    if (v.status === 'Paid') {
      paidSum += v.fine;
    } else {
      dueSum += v.fine;
      if (v.status === 'Pending' || v.status === 'Overdue') {
        pendingCount++;
      }
    }
  });

  return {
    totalViolations: violations.length,
    pendingCount: pendingCount,
    paidSum: paidSum,
    dueSum: dueSum,
  };
};

// --- Context Creation ---
const ViolationsContext = createContext(null);

export const ViolationsProvider = ({ children }) => {
  const [allViolations, setAllViolations] = useState([]);
  const [summaries, setSummaries] = useState({
    totalViolations: 0,
    pendingCount: 0,
    paidSum: 0,
    dueSum: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global filter state for violation type (controlled by Sidebar)
  const [activeTypeFilter, setActiveTypeFilter] = useState(null);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    const url = API_URL || `${JSON_DATA_URL}?_t=${new Date().getTime()}`; // Cache-busting for JSON
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();

      // Handle wrapped data (e.g., { "data": [...] } or { "results": [...] })
      if (typeof data === 'object' && !Array.isArray(data)) {
        data = data.data || data.results || data.violations || data.predictions || [];
      }

      if (Array.isArray(data)) {
        const normalizedData = data.map(mapRawDataToViolation);
        setAllViolations(normalizedData);
      } else {
        throw new Error('Fetched data is not an array');
      }
    } catch (e) {
      console.error('Failed to fetch violations:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Recalculate summaries whenever data changes
  useEffect(() => {
    const newSummaries = calculateSummaries(allViolations);
    setSummaries(newSummaries);
  }, [allViolations]);

  // --- Actions ---
  const markAsPaid = useCallback((violationId) => {
    setAllViolations((prevViolations) =>
      prevViolations.map((v) =>
        v.id === violationId ? { ...v, status: 'Paid' } : v
      )
    );
    // In a real app, this would also trigger a POST/PUT request to the API
    // e.g., api.markViolationPaid(violationId)
  }, []);

  // --- Memoized Value ---
  const value = useMemo(
    () => ({
      allViolations,
      summaries,
      loading,
      error,
      markAsPaid,
      activeTypeFilter,
      setActiveTypeFilter,
    }),
    [allViolations, summaries, loading, error, markAsPaid, activeTypeFilter, setActiveTypeFilter]
  );

  return (
    <ViolationsContext.Provider value={value}>
      {children}
    </ViolationsContext.Provider>
  );
};

// --- Custom Hook ---
export const useViolations = () => {
  const context = useContext(ViolationsContext);
  if (!context) {
    throw new Error('useViolations must be used within a ViolationsProvider');
  }
  return context;
};