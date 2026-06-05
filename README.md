# Reservacion admin — Internal Reservacion Management SPA

A **Single Page Application** built with **Vanilla JavaScript + Vite + Tailwind CSS** that allows a software company to manage its internal Reservaciones. Authentication, role-based access control, and data persistence are implemented against a mock REST API powered by **json-server**.

---

## Description

Reservacion admin provides two distinct user experiences:

| Role | Capabilities |
|------|-------------|
| **admin** | View dashboard stats · Full CRUD on all Reservaciones · Assign Reservaciones to user |
| **user** | View own assigned Reservaciones · Update project status only |

Sessions persist across page refreshes via `localStorage`, and the SPA navigates without ever reloading the browser.

---

## Technologies

| Layer | Tool |
|-------|------|
| Language | Vanilla JavaScript (ES Modules) |
| Bundler | [Vite](https://vite.dev/) v8 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 (CDN) |
| Mock API | [json-server](https://github.com/typicode/json-server) v1 |
| Node.js | ≥ 18 recommended |

---

## Installation

```bash
# 1. Clone or unzip the repository
cd todo-app

# 2. Install dependencies
npm install
```

---

## Running the Project

Two terminals are required — one for the mock API and one for the dev server.

### Running JSON Server (mock API)

```bash
# Terminal 1 — starts the REST API on http://localhost:3000
npm run api
```

Available endpoints once running:

```
GET    /users
GET    /Reservaciones
POST   /Reservaciones
PATCH  /Reservaciones/:id
DELETE /Reservaciones/:id
```

### Running the Frontend Dev Server

```bash
# Terminal 2 — starts Vite on http://localhost:5173 (default)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Important:** json-server must be running before you open the app, otherwise login will fail with a network error.

---

## Test Users

These users are pre-loaded in `database/db.json`. No registration is required or possible.

| Role | Email | Password |
|------|-------|----------|
| admin | `manager@test.com` | `123456` |
| user | `user@test.com` | `123456` |
| user | `maria@test.com` | `123456` |

---

## Reservacion Structure

```
todo-app/
├── database/
│   ├── db.json               # json-server data (users + Reservaciones)
│   └── db.js                 # Data access layer — all fetch() calls + session helpers
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # Static images (logos)
│   ├── components/
│   │   ├── layout.js         # Shared navbar shell (renders around every private view)
│   │   └── userCard.js       # Reusable user profile card component
│   ├── controllers/
│   │   ├── login.controller.js     # Handles login form submission & credential validation
│   │   ├── project.controller.js   # Full CRUD logic for admin + status-only for user
│   │   └── dashboard.controller.js # Computes and injects dashboard statistics
│   ├── views/
│   │   ├── loginView.js      # Login page HTML template
│   │   ├── dashboardView.js  # admin stats dashboard template
│   │   ├── homeView.js       # admin full project list template
│   │   ├── userView.js       # user assigned Reservaciones template
│   │   └── notFoundView.js   # 404 fallback template
│   └── main.js               # SPA router — hash-based navigation + auth guards
├── index.html                # App shell — single <div id="app"> entry point
└── package.json
```

---

## Role Permissions

### admin
- ✅ View all Reservaciones
- ✅ Create new Reservaciones (name, description, status, responsible user, date)
- ✅ Edit any project (all fields)
- ✅ Delete any project
- ✅ View dashboard with stats (total, active, completed, pending)
- ✅ Access `/home` and `/dashboard` routes

### user
- ✅ View reservation assigned to them only
- ✅ Update the **status** of their own Reservaciones
- ❌ Cannot create Reservaciones
- ❌ Cannot delete Reservaciones
- ❌ Cannot edit other users' Reservaciones
- ❌ Cannot access `/home` or `/dashboard` (redirected to `/Reservaciones`)

---

## Technical Decisions

### Hash-based SPA routing
`window.location.hash` is used for client-side navigation because it requires zero server configuration — `index.html` is always served and JavaScript handles the rest. The router lives in `main.js` and listens to both `hashchange` and `load` events.

### Guard strategy
Route guards are evaluated on every navigation event inside `router()`. Two rules apply:
1. **Unauthenticated** → always redirect to `#login`
2. **user on a manager-only route** → redirect to `#Reservaciones`

### Session persistence
The logged-in user object is serialised to `localStorage` under the key `currentUser`. This survives page refreshes and browser restarts. Logout explicitly calls `clearSession()` which removes the key.

### Data access layer (`db.js`)
All `fetch()` calls are centralised in a single module. Controllers import named functions (`getReservacions`, `createReservacion`, etc.) rather than constructing URLs themselves. This makes the API base URL easy to change and keeps controllers focused on UI logic.

### PATCH over PUT
Reservacion updates use `PATCH` so that partial payloads (e.g. only `{ status }` for user) don't overwrite unrelated fields.

### Role-aware rendering
`project.controller.js` accepts an `isadmin` boolean that controls which action buttons are rendered (Edit/Delete vs status dropdown). A single controller file handles both roles, avoiding code duplication.

### Toast notifications
A lightweight `showToast()` utility injects a temporary `<div>` into the DOM, then fades it out after 2.7 s. No external library is needed.

---

## Extra Features Implemented

- **Search** — live text filter on project name
-  **Status filter** — dropdown filter by project status
-  **Toast notifications** — feedback on create / update / delete
-  **Persistent session** — survives page refresh via `localStorage`
-  **Stats dashboard** — four stat cards for admin role

---

## License

Academic / educational project — RIWI Coding Bootcamp.
