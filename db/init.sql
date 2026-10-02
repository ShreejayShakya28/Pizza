-- Runs once, when the volume is first created.
CREATE TABLE IF NOT EXISTS menu_items (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)   NOT NULL,
  description VARCHAR(200)  NOT NULL,
  price_cents INTEGER       NOT NULL CHECK (price_cents > 0)
);

-- DEMO ONLY: `password` is stored as plain text on purpose (no hashing, no auth).
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(120) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  age        INTEGER      CHECK (age BETWEEN 1 AND 120),
  gender     VARCHAR(20)  CHECK (gender IN ('female', 'male', 'non-binary', 'prefer-not-to-say')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- `items` is a price snapshot: [{ itemId, name, unitPriceCents, quantity }].
-- Old orders keep their original prices even if the menu changes later.
CREATE TABLE IF NOT EXISTS orders (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items          JSONB       NOT NULL,
  subtotal_cents INTEGER     NOT NULL CHECK (subtotal_cents > 0),
  tip_cents      INTEGER     NOT NULL DEFAULT 0 CHECK (tip_cents >= 0),
  total_cents    INTEGER     NOT NULL CHECK (total_cents > 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders (user_id, created_at DESC);

INSERT INTO menu_items (name, description, price_cents) VALUES
  ('Margherita',   'San Marzano tomato, fresh mozzarella, basil',            1100),
  ('Pepperoni',    'Tomato, mozzarella, crisp-edged pepperoni',              1300),
  ('Four Cheese',  'Mozzarella, gorgonzola, fontina and parmesan',           1400),
  ('Veggie Garden','Roasted peppers, mushrooms, olives, red onion',          1250),
  ('BBQ Chicken',  'Smoky BBQ sauce, grilled chicken, red onion, cilantro',  1450),
  ('Diavola',      'Spicy salami, chili oil, mozzarella, hot honey',         1350);

-- Demo login so you can try the app immediately.
INSERT INTO users (name, email, password) VALUES ('Maya', 'maya@example.com', 'pizza123');
