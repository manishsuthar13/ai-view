# AI-View

Full-stack web app with JWT cookie auth. Frontend is React + Vite; backend is Express + MongoDB. Auth (register / login / logout / session restore) is in place. An `ai` feature folder exists on the frontend but is empty so far.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Axios, Sass |
| Backend | Express 5, Mongoose 9, JWT, bcryptjs, cookie-parser, cors, dotenv |
| Database | MongoDB |
| Dev | Nodemon (backend), ESLint (frontend) |

## Project Structure

```
AI-View/
├── backend/
│   ├── server.js                 # entry — connects DB, listens on :3000
│   ├── .env                      # MONGO_URI, JWT_SECRET (not committed)
│   └── src/
│       ├── app.js                # Express app, CORS, routes
│       ├── config/database.js    # mongoose connect
│       ├── controllers/auth.controller.js
│       ├── middlewares/auth.middleware.js
│       ├── models/
│       │   ├── user.model.js
│       │   └── blacklist.model.js
│       └── routes/auth.routes.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx               # AuthProvider + RouterProvider
        ├── app.routes.jsx        # /login, /register, / (protected)
        ├── style.scss
        ├── styles/button.scss
        └── features/
            ├── ai/               # placeholder — empty
            └── auth/
                ├── auth.context.jsx
                ├── auth.form.scss
                ├── hooks/useAuth.js
                ├── services/auth.api.js
                ├── components/Protected.jsx
                └── pages/
                    ├── Login.jsx
                    └── Register.jsx
```

## Features (current)

- **Register** — username, email, password; bcrypt hash; JWT set as `token` cookie; returns user
- **Login** — email + password; JWT cookie; returns user
- **Logout** — blacklists current JWT in MongoDB, clears cookie
- **Get Me** — restores session from cookie (used on app load)
- **Protected routes** — `/` requires auth; redirects to `/login` if unauthenticated
- **Auth context + `useAuth` hook** — login / register / logout / session bootstrap
- **CORS** — allows `http://localhost:5173` with credentials

## API

Base URL: `http://localhost:3000`

Auth cookie: `token` (JWT, expires in 1 day)

| Method | Endpoint | Access | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ username, email, password }` | Create user, set cookie |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticate, set cookie |
| `GET` | `/api/auth/logout` | Public | — | Blacklist token, clear cookie |
| `GET` | `/api/auth/get-me` | Private | — | Current user from JWT cookie |

### Models

**User** (`users`)

| Field | Type | Notes |
|---|---|---|
| `username` | String | required, unique |
| `email` | String | required, unique |
| `password` | String | required, bcrypt-hashed |

**BlacklistToken** (`blacklistTokens`)

| Field | Type | Notes |
|---|---|---|
| `token` | String | required |
| `createdAt` / `updatedAt` | Date | via `timestamps: true` |

### Auth middleware

Reads `token` from cookies → rejects if missing / blacklisted / invalid JWT → attaches decoded payload to `req.user` (`{ id, username }`).

## Frontend Routes

| Path | Access | Page |
|---|---|---|
| `/login` | Public | Login form |
| `/register` | Public | Register form |
| `/` | Protected | Placeholder home (`<h1>Home Page</h1>`) |

Axios client (`auth.api.js`) uses `baseURL: http://localhost:3000` and `withCredentials: true` so cookies go both ways.

## Setup

### Prerequisites

- Node.js
- MongoDB (local or Atlas URI)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
# → http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Scripts

**Backend** (`backend/`)

| Script | Command |
|---|---|
| `npm run dev` | `nodemon server.js` |

**Frontend** (`frontend/`)

| Script | Command |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Auth Flow

1. Register or login → backend hashes/verifies password, signs JWT, sets `token` http cookie
2. Frontend stores user in `AuthContext`
3. On load, `useAuth` calls `/api/auth/get-me`; if cookie valid, restores user
4. `Protected` waits for `loading === false`, then renders children or redirects to `/login`
5. Logout → token saved to blacklist → cookie cleared → `user` set to `null`

## Notes

- `.env`, `node_modules`, and `temp.txt` are gitignored
- `frontend/src/features/ai/` is reserved for future AI features — nothing implemented yet
- Cookie `secure` / `httpOnly` / `sameSite` options are not customized yet (Express default cookie behavior)
