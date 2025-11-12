Time Tracker Starter Kit
========================

This starter kit contains a backend (Node + Express + Prisma + SQLite) and a frontend (React + Vite).
It's meant to be a minimal, local, copy-paste-ready starting point.

Locations:
- backend/  -> API server
- frontend/ -> React UI

Quick start (on your Mac Terminal)
---------------------------------
1) Backend
   cd time-tracker-starter/backend
   npm install
   # create a .env file by copying .env.example and set JWT_SECRET if desired
   cp .env.example .env
   npx prisma migrate dev --name init
   npm run dev

   Backend will run on http://localhost:4000

2) Frontend
   cd ../frontend
   npm install
   npm run dev

   Frontend will run on http://localhost:5173

Notes
-----
- The backend uses SQLite for easy local setup (file: prisma/dev.db).
- The frontend is lightweight React + Vite; it stores JWT in localStorage for simplicity.
- This is a starter kit: features included:
  - Employee CRUD (name, email, role)
  - Time entries with category, notes, clockIn/clockOut, and optional location (lat/lng)
  - Simple auth: signup/login (bcrypt + JWT)
  - Simple UI to login, view employees, clock in/out, and add categories

Security & production
---------------------
- Do NOT use sqlite for multi-instance production.
- Use httpOnly cookies or a secure token store for auth in production.
- Set a strong JWT_SECRET in .env.

