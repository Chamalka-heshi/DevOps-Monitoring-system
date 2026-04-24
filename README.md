# 🖥️ DevOps Dashboard

A full-stack MERN DevOps monitoring dashboard with real-time system metrics, JWT authentication, and live charts.

## Stack
- **Frontend**: React 18 + Vite + Recharts + Axios
- **Backend**: Node.js + Express 4 + MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Security**: express-rate-limit, env-based secrets, scoped CORS

---

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) **OR** a MongoDB Atlas URI

---

## Setup & Run

### 1. Backend

```bash
cd server
npm install
# Edit .env if needed (defaults work for local MongoDB)
npm run dev       # uses nodemon for hot reload
# OR
npm start         # plain node
```

Server starts at **http://localhost:5000**

### 2. Frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

App opens at **http://localhost:5173**

---

## First use
1. Go to http://localhost:5173
2. Click **Register** → create an account
3. Log in with those credentials
4. The dashboard will start polling metrics every 3 seconds

---

## Environment variables (server/.env)

| Variable        | Default                                        | Description            |
|-----------------|------------------------------------------------|------------------------|
| `PORT`          | `5000`                                         | Server port            |
| `MONGO_URI`     | `mongodb://127.0.0.1:27017/devops-dashboard`   | MongoDB connection      |
| `JWT_SECRET`    | *(set a strong value in production)*           | JWT signing secret     |
| `CLIENT_ORIGIN` | `http://localhost:5173`                        | Allowed CORS origin    |

---

## Project structure

```
devops-dashboard/
├── client/                   React + Vite frontend
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx   Auth state + localStorage
│   │   ├── pages/
│   │   │   ├── Login.jsx         Login + Register tabs
│   │   │   └── Dashboard.jsx     Live metrics + charts
│   │   ├── App.jsx               Route between Login/Dashboard
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js            Dev proxy → localhost:5000
│   └── package.json
│
└── server/                   Express backend
    ├── middleware/
    │   └── auth.js               JWT verification (reads process.env.JWT_SECRET)
    ├── models/
    │   └── User.js               Mongoose user schema
    ├── routes/
    │   ├── authRoutes.js         POST /api/auth/register, /login
    │   └── systemRoutes.js       GET /api/stats (protected)
    ├── utils/
    │   └── system.js             os module → CPU, memory, uptime
    ├── server.js                 Single entry point
    ├── .env                      Secrets (not committed)
    └── package.json
```

---

## Bugs fixed from original code

| # | Bug | Fix |
|---|-----|-----|
| 1 | `console.log("Token:", token)` before imports — parse error | Removed |
| 2 | JWT signed with `"your_jwt_secret_here"` but verified with `"your_jwt_secret"` | Both now read `process.env.JWT_SECRET` |
| 3 | Two entry points: `server.js` and `index.js` both binding port 5000 | Deleted `index.js`, single `server.js` |
| 4 | `if (!token) return <Login />` before `useEffect` — React hooks rule violation | Guard moved inside `useEffect`, return moved after all hooks |
| 5 | `authMiddleware` applied twice (router level + per-route) | Applied once, in `systemRoutes.js` only |
| 6 | No error state — backend unreachable = forever "Loading…" | Error state + meaningful messages |
| 7 | Hardcoded secrets in source code | All secrets in `.env` via dotenv |
| 8 | Wildcard CORS `cors()` | Scoped to `CLIENT_ORIGIN` env var |
| 9 | No rate limiting on auth routes | `express-rate-limit`: 10 req/15 min |
| 10 | Hardcoded MongoDB URI | Reads `process.env.MONGO_URI` |
