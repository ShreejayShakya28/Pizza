import { useState } from 'react';
import { calcTip, formatPrice } from '../utils/money.js';
import Button from './Button.jsx';
import Modal from './Modal.jsx';

// lines: [{ item: { id: 1, name: "Margherita", price_cents: 1100 }, quantity: 2 }, ...]
// With 2 Margherita + 1 Pepperoni and a 15% tip: subtotal $35.00 + tip $5.25 = $40.25
export default function TipDialog({ lines, tipOptions, busy, onConfirm, onClose }) {
  // Start on the middle option (15% for [10, 15, 20]).
  const [tipPercent, setTipPercent] = useState(tipOptions[1] ?? tipOptions[0] ?? 0);

  const subtotal = lines.reduce((sum, l) => sum + l.item.price_cents * l.quantity, 0);
  const tip = calcTip(subtotal, tipPercent);
  const total = subtotal + tip;

  return (
    <Modal title="Add a tip?" onClose={onClose}>
      <ul className="divide-y divide-ink/10">
        {lines.map(({ item, quantity }) => (
          <li key={item.id} className="flex justify-between py-2">
            <span>{quantity} × {item.name}</span>
            <span className="tabular-nums">{formatPrice(item.price_cents * quantity)}</span>
          </li>
        ))}
      </ul>

      <div role="radiogroup" aria-label="Tip amount" className="mt-5 grid grid-cols-3 gap-3">
        {tipOptions.map((percent) => {
          const selected = percent === tipPercent;
          return (
            <button
              key={percent}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTipPercent(percent)}
              className={`rounded-xl border-2 px-2 py-3 text-center transition
                          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-enamel
                          ${selected ? 'border-enamel bg-enamel text-white' : 'border-ink/20 hover:border-ink/40'}`}
            >
              <span className="block text-lg font-bold">{percent}%</span>
              <span className="block text-sm tabular-nums opacity-80">
                {formatPrice(calcTip(subtotal, percent))}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setTipPercent(0)}
        className={`mt-3 text-sm underline ${tipPercent === 0 ? 'font-semibold text-enamel' : 'text-ink/60'}`}
      >
        No tip
      </button>

      <dl className="mt-5 space-y-1 border-t border-ink/10 pt-4">
        <div className="flex justify-between text-ink/70">
          <dt>Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ink/70">
          <dt>Tip</dt><dd className="tabular-nums">{formatPrice(tip)}</dd>
        </div>
        <div className="flex justify-between text-xl font-extrabold">
          <dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>

      <Button className="mt-5 w-full" disabled={busy} onClick={() => onConfirm(tipPercent)}>
        {busy ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
      </Button>
    </Modal>
  );
}
