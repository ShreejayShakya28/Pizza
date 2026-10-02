import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { formatPrice } from '../utils/money.js';
import Button from './Button.jsx';
import CartBar from './CartBar.jsx';
import MenuRow from './MenuRow.jsx';
import MyOrders from './MyOrders.jsx';
import ProfileModal from './ProfileModal.jsx';
import TipDialog from './TipDialog.jsx';

const MAX_QUANTITY = 20; // mirrors the server-side limit

export default function PizzaShop({ user, onUserChange, onSignOut }) {
  const [page, setPage] = useState(null);       // { shop: {..., tipOptions: [10, 15, 20]}, items: [...] }
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});         // { 1: 2, 2: 1 } = 2 × Margherita, 1 × Pepperoni
  const [dialog, setDialog] = useState(null);   // null | 'profile' | 'tip'
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [busy, setBusy] = useState(false);

  const closeDialog = useCallback(() => setDialog(null), []);

  const refreshOrders = useCallback(async () => {
    try {
      setOrders(await api.getOrders(user.id));
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  }, [user.id]);

  useEffect(() => {
    (async () => {
      try {
        const [menu, mine] = await Promise.all([api.getMenu(), api.getOrders(user.id)]);
        setPage(menu);
        setOrders(mine);
      } catch (err) {
        setStatus({ type: 'error', message: err.message });
      }
    })();
  }, [user.id]);

  const changeQuantity = (itemId, delta) =>
    setCart((prev) => {
      const next = { ...prev, [itemId]: Math.min((prev[itemId] ?? 0) + delta, MAX_QUANTITY) };
      if (next[itemId] <= 0) delete next[itemId];
      return next;
    });

  const lines = useMemo(
    () => (page?.items ?? []).filter((i) => cart[i.id]).map((item) => ({ item, quantity: cart[item.id] })),
    [page, cart]
  );
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + l.item.price_cents * l.quantity, 0);

  const handlePlaceOrder = async (tipPercent) => {
    setBusy(true);
    try {
      const order = await api.placeOrder({
        userId: user.id,
        items: lines.map(({ item, quantity }) => ({ itemId: item.id, quantity })),
        tipPercent,
      });
      setCart({});
      setStatus({
        type: 'ok',
        message: `Thanks, ${user.name}! Order #${order.id} is in: ${formatPrice(order.total_cents)}.`,
      });
      await refreshOrders();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setDialog(null);
      setBusy(false);
    }
  };

  if (!page) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p role="status">{status.type === 'error' ? status.message : 'Firing up the oven…'}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-8">
      <nav className="mb-10 flex items-center justify-between gap-4">
        <p className="text-ink/70">Signed in as <strong className="text-ink">{user.name}</strong></p>
        <div className="flex gap-2">
          <Button variant="ghost" className="py-1.5 text-sm" onClick={() => setDialog('profile')}>My profile</Button>
          <Button variant="ghost" className="py-1.5 text-sm" onClick={onSignOut}>Sign out</Button>
        </div>
      </nav>

      <header>
        <h1 className="text-6xl font-extrabold tracking-tight">{page.shop.name}</h1>
        <p className="mt-2 text-lg text-ink/70">{page.shop.tagline}</p>
      </header>

      <p
        role="status"
        className={`mt-6 min-h-6 font-medium ${status.type === 'error' ? 'text-red-700' : 'text-enamel'}`}
      >
        {status.message}
      </p>

      <ul className="mt-2 divide-y divide-ink/10">
        {page.items.map((item) => (
          <MenuRow
            key={item.id}
            item={item}
            quantity={cart[item.id] ?? 0}
            disabled={busy}
            onAdd={(i) => changeQuantity(i.id, 1)}
            onRemove={(i) => changeQuantity(i.id, -1)}
          />
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="mb-3 text-2xl font-semibold">My orders</h2>
        <MyOrders orders={orders} />
      </section>

      <CartBar
        count={count}
        subtotalCents={subtotalCents}
        disabled={busy}
        onCheckout={() => setDialog('tip')}
        onClear={() => setCart({})}
      />

      {dialog === 'profile' && (
        <ProfileModal user={user} onClose={closeDialog} onSaved={onUserChange} />
      )}
      {dialog === 'tip' && lines.length > 0 && (
        <TipDialog
          lines={lines}
          tipOptions={page.shop.tipOptions}
          busy={busy}
          onConfirm={handlePlaceOrder}
          onClose={closeDialog}
        />
      )}
    </main>
  );
}
