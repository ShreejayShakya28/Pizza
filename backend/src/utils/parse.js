import { AppError } from './AppError.js';

// "42" -> 42, "abc" / 0 / -3 / 1.5 -> 400. Used for ids and quantities.
export function parsePositiveInt(value, label) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw new AppError(`${label} must be a positive integer`, 400);
  }
  return n;
}
