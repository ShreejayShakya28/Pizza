# Little Slice: React + Express + Postgres (test repo)

```
coffee-shop/              (folder name is yours to change)
├── docker-compose.yml    # Postgres only (named volume: coffee_pgdata)
├── db/init.sql           # users, menu_items, orders + seed data
├── backend/              # Express API (port 4000)
└── frontend/             # React + Tailwind single page (port 5173)
```

## Run it
```bash
# 1. Database
docker compose up -d

# 2. Backend
cd backend && npm install && npm run dev

# 3. Frontend (new terminal)
cd frontend && npm install && npm run dev
```
Open http://localhost:5173 and sign in with the demo account
`maya@example.com` / `pizza123`, or create your own.

> Demo only: passwords are stored in plain text and there are no sessions or tokens.
> The browser just remembers who you are and sends your `userId`.

## API
| Method | Path                | Purpose                                         |
|--------|---------------------|-------------------------------------------------|
| GET    | /api/health         | API + DB check                                  |
| GET    | /api/menu           | Shop info, tip options and the pizza menu       |
| POST   | /api/users/signup   | `{name,email,password}`                         |
| POST   | /api/users/login    | `{email,password}`                              |
| GET    | /api/users/:id      | Profile                                         |
| PATCH  | /api/users/:id      | `{name,age,gender}`                             |
| GET    | /api/orders?userId= | That user's 10 most recent orders               |
| POST   | /api/orders         | `{userId,items:[{itemId,quantity}],tipPercent}` |

## Reset the database
`init.sql` only runs on a fresh volume:
```bash
docker compose down -v && docker compose up -d
```
say this the fix
