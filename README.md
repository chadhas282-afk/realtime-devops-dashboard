# Real-Time DevOps Dashboard

A production-grade real-time DevOps/Project Manager dashboard with live Kanban board, activity feed, user presence, and WebSocket synchronization.

## 🚀 Tech Stack

**Backend:** Node.js + Express + Socket.io + MongoDB + TypeScript  
**Frontend:** React 18 + Redux Toolkit + Framer Motion + Tailwind CSS + Vite

## 📦 Project Structure

```
realtime-devops-dashboard/
├── backend/          # Express + Socket.io + MongoDB API
├── frontend/         # React + Tailwind + Redux dashboard
├── docker-compose.yml
└── README.md
```

## 🛠️ Quick Start

### Option 1: Docker Compose (recommended)

```bash
docker-compose up
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env          # Edit with your MongoDB URI
npm install
npm run dev                   # Dev: ts-node-dev with hot reload
# or: npm run build && npm start   # Production
```

**Frontend:**
```bash
cd frontend
cp .env.example .env          # Optional: set VITE_API_URL
npm install
npm run dev                   # Dev server on http://localhost:3000
# or: npm run build           # Production build
```

## 🔑 Mock Authentication

Three demo accounts (password: `demo`):
- `alice@demo.com`
- `bob@demo.com`  
- `carol@demo.com`

## ✨ Features

- **Kanban Board** — 4-column board (Backlog → In Progress → Testing → Deployed) with drag-and-drop
- **Real-Time Sync** — WebSocket bidirectional communication; changes reflect instantly across all browser tabs
- **Activity Feed** — Auto-scrolling real-time log of all team actions
- **Live Metrics** — Task distribution, team presence, deployment status
- **User Presence** — Online/away/busy/offline indicators
- **Smooth Animations** — Framer Motion transitions for card drag & modal appearance
- **Toast Notifications** — Success/error/info/warning feedback
- **Mock JWT Auth** — LocalStorage token with protected routes
- **Dark Mode** — Apple-like minimal dark UI

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Mock login |
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/activities` | Activity feed |
| GET | `/api/users` | All users |
| GET | `/api/deployments` | Deployments |

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `task:create` | Client → Server | Create a task |
| `task:update` | Client → Server | Update a task |
| `task:delete` | Client → Server | Delete a task |
| `task:created` | Server → Client | Task was created |
| `task:updated` | Server → Client | Task was updated |
| `task:deleted` | Server → Client | Task was deleted |
| `activity:new` | Server → Client | New activity entry |
| `user:join` | Client → Server | User comes online |
| `user:online` | Server → Client | User presence added |
| `presence:update` | Client → Server | Status change |

## 🌐 Deployment

**Frontend → Vercel:**
1. Set `VITE_API_URL` env var to your backend URL
2. Push to GitHub — Vercel auto-deploys

**Backend → Railway/Render:**
1. Set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`
2. Deploy via Docker or Node.js buildpack

## License
This project is licensed under the MIT License.