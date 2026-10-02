import { useCallback, useState } from 'react';

const STORAGE_KEY = 'littleslice:user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // storage blocked or corrupted JSON: behave as signed out
  }
}

// Keeps "who is signed in" across refreshes. This is a UI convenience, not security.
// Example value: { id: 1, name: "Maya", email: "maya@example.com", age: 28, gender: "female" }
export function useStoredUser() {
  const [user, setUserState] = useState(readStoredUser);

  const setUser = useCallback((next) => {
    setUserState(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable: the session just won't survive a refresh */
    }
  }, []);

  return [user, setUser];
}
