import { useState, useEffect } from 'react';

// Helper function to get stored value or initial value
function getStoredValue(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return initialValue;
  }
}

/**
 * A custom hook to manage state in localStorage.
 * It syncs state with localStorage on change.
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getStoredValue(key, initialValue);
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      if (storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}