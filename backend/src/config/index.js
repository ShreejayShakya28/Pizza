import 'dotenv/config';

// Single place that reads process.env, so the rest of the app never touches it.
export const config = Object.freeze({
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://pizza:pizza_pass@localhost:5439/pizza_db',
  shop: Object.freeze({
    name: 'Little Slice',
    tagline: 'Hand-stretched dough. Wood-fired. Ready in minutes.',
    // Tip choices offered at checkout, as percentages of the subtotal.
    tipOptions: Object.freeze([10, 15, 20]),
  }),
});
