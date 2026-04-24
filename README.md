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
