# CollegeBazaar

A campus marketplace web app where students can list, browse, and bid on items. Built with a React (Vite) frontend and an Express + PostgreSQL backend.

## About this project

This project was originally built together with [Seearun20](https://github.com/Seearun20/Collegebazaar) (frontend) and [Darkknight0125](https://github.com/Darkknight0125/CollegeBazaar) (backend). This repo extends that work with **Google OAuth login**, added on top of the existing email/password + OTP signup flow without changing any existing logic.

## Structure

- `frontend/` — React + Vite client
- `backend/` — Express REST API + PostgreSQL

## New in this fork: Google OAuth Login

Students can now sign in with their Google account (still restricted to the campus email domain) as an alternative to the existing email/password login. See `backend/controllers/userController.js` (`googleLogin`) and `frontend/src/components/AuthPage.jsx` for the implementation, and the Setup section below for configuration.

## Setup

### Backend

```bash
cd backend
npm install
cp .env_example .env   # fill in DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, etc.
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill in VITE_API_URL, VITE_GOOGLE_CLIENT_ID
npm run dev
```
