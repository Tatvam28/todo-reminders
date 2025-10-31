# Todo App with Email Reminders

A full-stack Todo application with user authentication and email reminders scheduled X minutes before task due time.  
Backend: Node.js + Express + MongoDB + Agenda.js  
Frontend: React (Vite)

---

## Features

- User signup/login (JWT + bcrypt)
- Create/edit/delete/list tasks (title, description, optional due date & time, completed)
- Background job (Agenda.js) schedules reminder emails X minutes before due time (default 30)
- Reminders sent via SMTP (nodemailer) or logged to console if SMTP not configured
- When due time changes, reminder is rescheduled. When task completed or deleted, reminder canceled
- Simple React frontend (Vite) with pages for Signup, Login, and Tasks

---

## Requirements

- Node.js (LTS)
- npm or yarn
- MongoDB (local or remote)

---

## Quick Start - Backend

### 1. Clone repo and install

```bash
cd todo-reminders/backend
npm install

```

### 2. Create `.env` file



Create a new `.env` file in the `backend` directory by copying `.env.example` and filling in your own values.

#### Example `.env` file
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo_reminders
JWT_SECRET=supersecret
REMINDER_MINUTES=30

# Optionally configure SMTP for real emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=yourpassword
SMTP_SECURE=false
```
### 3. Start MongoDB locally

On Windows, use MongoDB Community Server and start the service.

### 4. Seed test user (optional)
```bash
npm run seed
# outputs: Seeded test user: email=test@example.com password=password123
```

### 5. Start server
```bash
npm run dev
# or
npm start
```

Server will run at http://localhost:5000.

Agenda will start and listen for scheduled jobs.

## Quick Start - Frontend

In another terminal:
```bash
cd todo-reminders/frontend
npm install
npm run dev
```

Open http://localhost:5173 (Vite default) or follow terminal URL.

Login with seeded user if you ran seed:

Email: test@example.com

Password: password123

## How Reminders Work

When you create a task with a dueAt datetime, backend schedules an Agenda job at dueAt - REMINDER_MINUTES

If REMINDER_MINUTES is 30 (default), reminder fires 30 minutes before the due time

If SMTP is configured (SMTP_HOST, SMTP_USER, SMTP_PASS), nodemailer will send real emails

Otherwise, email content is printed to backend console for local testing

## API Endpoints (Examples)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/signup` | Register new user — body: `{ name, email, password }` |
| POST | `/api/auth/login` | Login user — body: `{ email, password }` (returns token) |
| GET | `/api/tasks` | (Auth) Get list of tasks for the logged-in user |
| POST | `/api/tasks` | (Auth) Create a new task — body: `{ title, description?, dueAt? }` |
| PUT | `/api/tasks/:id` | Update a task by its ID |
| DELETE | `/api/tasks/:id` | Delete a task by its ID |
| POST | `/api/tasks/:id/complete` | Mark a task as complete |

**Note:** Include Authorization: Bearer <token> header for protected endpoints.  

## Test Reminder Immediately (Debug)

If you want to test quickly:

- Create a task due in about 40 minutes  
- With `REMINDER_MINUTES=30`, you'll get a reminder in approximately 10 minutes  
- Alternatively, adjust `REMINDER_MINUTES` to `0` or `1` for rapid testing (remember to set it back afterward)

---

## How to Test Reminders Locally

1. Ensure backend logs printed emails if SMTP is not configured  
2. Set `.env` variable `REMINDER_MINUTES` to a small value (e.g., `1`)  
3. Create a task with `dueAt = now + 2 minutes`  
4. Start the server using:
   ```bash
   npm run dev
   ```

## Sample Requests & How to Test Reminder Feature

1. Start MongoDB locally  

2. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. Signup or Login on the frontend (or use curl / Postman)  
5. Set `REMINDER_MINUTES=1` in your `.env` file to test quickly  
6. Create a task with `dueAt = now + 2 minutes` (use the frontend date/time picker or provide an ISO date)  
7. Watch backend logs — about 1 minute before the due time, you will see an email printed or sent
