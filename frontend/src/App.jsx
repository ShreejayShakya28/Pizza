import { useEffect, useState } from 'react';
import { api } from './api.js';
import { useStoredUser } from './hooks/useStoredUser.js';
import AuthGate from './components/AuthGate.jsx';
import PizzaShop from './components/PizzaShop.jsx';

// The "gate": no user stored -> login/signup page, otherwise the shop.
export default function App() {
  const [user, setUser] = useStoredUser();
  const [checking, setChecking] = useState(Boolean(user));

  // A stored user can go stale (e.g. after `docker compose down -v`). Re-check once on load.
  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const fresh = await api.getProfile(user.id);
        if (!cancelled) setUser(fresh.email === user.email ? fresh : null);
      } catch (err) {
        if (!cancelled && err.status === 404) setUser(null);
        // Any other error (server down): keep the stored user and let the page show the error.
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p role="status">Firing up the oven…</p>
      </main>
    );
  }

  if (!user) return <AuthGate onAuthed={setUser} />;

  return (
    <PizzaShop
      key={user.id}
      user={user}
      onUserChange={setUser}
      onSignOut={() => setUser(null)}
    />
  );
}
