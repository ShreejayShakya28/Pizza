import { pool } from '../config/db.js';

export const menuRepository = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT id, name, description, price_cents FROM menu_items ORDER BY id'
    );
    return rows;
  },

  // findByIds([2, 3]) -> [{ id: 2, name: "Pepperoni", ... }, { id: 3, name: "Four Cheese", ... }]
  async findByIds(ids) {
    const { rows } = await pool.query(
      'SELECT id, name, price_cents FROM menu_items WHERE id = ANY($1::int[])',
      [ids]
    );
    return rows;
  },
};
