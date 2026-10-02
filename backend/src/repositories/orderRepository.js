import { pool } from '../config/db.js';

const COLUMNS = 'id, user_id, items, subtotal_cents, tip_cents, total_cents, created_at';

export const orderRepository = {
  async create({ userId, items, subtotalCents, tipCents, totalCents }) {
    const { rows } = await pool.query(
      `INSERT INTO orders (user_id, items, subtotal_cents, tip_cents, total_cents)
       VALUES ($1, $2::jsonb, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [userId, JSON.stringify(items), subtotalCents, tipCents, totalCents]
    );
    return rows[0];
  },

  async findByUser(userId, limit = 10) {
    const { rows } = await pool.query(
      `SELECT ${COLUMNS}
         FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },
};
