import { formatPrice } from '../utils/money.js';
import Button from './Button.jsx';

// Sticky bar that appears once something is in the cart: "3 items  $35.00  [Clear] [Checkout]"
export default function CartBar({ count, subtotalCents, disabled, onCheckout, onClear }) {
  if (count === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-sage/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-3">
        <p>
          <strong>{count} {count === 1 ? 'item' : 'items'}</strong>
          <span className="ml-3 tabular-nums">{formatPrice(subtotalCents)}</span>
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" disabled={disabled} onClick={onClear}>Clear</Button>
          <Button disabled={disabled} onClick={onCheckout}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}
