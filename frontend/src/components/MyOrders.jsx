import { formatPrice } from '../utils/money.js';

// [{ quantity: 2, name: "Margherita" }, { quantity: 1, name: "Pepperoni" }] -> "2 × Margherita, 1 × Pepperoni"
const summarize = (items) => items.map((i) => `${i.quantity} × ${i.name}`).join(', ');

const formatWhen = (iso) =>
  new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function MyOrders({ orders }) {
  if (orders.length === 0) {
    return <p className="text-ink/60">No orders yet. Pick a pizza from the menu.</p>;
  }
  return (
    <ul className="divide-y divide-ink/10">
      {orders.map((o) => (
        <li key={o.id} className="flex justify-between gap-4 py-3">
          <div>
            <p className="font-semibold">{summarize(o.items)}</p>
            <p className="text-sm text-ink/60">
              {o.tip_cents > 0 ? `Includes ${formatPrice(o.tip_cents)} tip` : 'No tip'}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-semibold tabular-nums">{formatPrice(o.total_cents)}</p>
            <time className="text-sm tabular-nums text-ink/50" dateTime={o.created_at}>
              {formatWhen(o.created_at)}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
