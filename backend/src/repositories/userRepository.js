import { pool } from '../config/db.js';

// The password column is never part of this list, so it can't leak by accident.
const PUBLIC_COLUMNS = 'id, name, email, age, gender, created_at';

export const userRepository = {
  async create({ name, email, password }) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING ${PUBLIC_COLUMNS}`,
      [name, email, password]
    );
    return rows[0];
  },

  // Only used by login: the one place that needs the stored password.
  async findWithPasswordByEmail(email) {
    const { rows } = await pool.query(
      `SELECT ${PUBLIC_COLUMNS}, password FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] ?? null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] ?? null;
  },

  async updateProfile(id, { name, age, gender }) {
    const { rows } = await pool.query(
      `UPDATE users SET name = $2, age = $3, gender = $4
        WHERE id = $1
        RETURNING ${PUBLIC_COLUMNS}`,
      [id, name, age, gender]
    );
    return rows[0] ?? null;
  },
};
