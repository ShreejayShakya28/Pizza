import { formatPrice } from '../utils/money.js';
import Button from './Button.jsx';

function StepButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 rounded-full border-2 border-ink/20 text-lg leading-none transition
                 hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-enamel disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export default function MenuRow({ item, quantity, disabled, onAdd, onRemove }) {
  return (
    <li className="py-5">
      <div className="flex items-baseline gap-3">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        {/* dotted leader, like a printed menu board */}
        <span aria-hidden className="flex-1 border-b-2 border-dotted border-ink/30" />
        <span className="text-xl tabular-nums">{formatPrice(item.price_cents)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-4">
        <p className="text-ink/70">{item.description}</p>
        {quantity === 0 ? (
          <Button className="shrink-0 py-1.5 text-sm" disabled={disabled} onClick={() => onAdd(item)}>
            Add
          </Button>
        ) : (
          <div className="flex shrink-0 items-center gap-2" role="group" aria-label={`${item.name} quantity`}>
            <StepButton label={`Remove one ${item.name}`} disabled={disabled} onClick={() => onRemove(item)}>−</StepButton>
            <span className="w-6 text-center font-semibold tabular-nums">{quantity}</span>
            <StepButton label={`Add one ${item.name}`} disabled={disabled} onClick={() => onAdd(item)}>+</StepButton>
          </div>
        )}
      </div>
    </li>
  );
}
