# City Info Portal

A full-stack web application for displaying and managing city information.

## Project Structure

```
city-info-website/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
│   └── database/      # Database models, migrations, and seeders
└── README.md          # Project documentation
```

## Getting Started

### Database Setup (MySQL)

1.  **Install & Start MySQL:**
    -   Ensure MySQL Server is installed and running on your local machine.
    -   Create a database named `city_info`.
    -   **Default Credentials:** `DB_HOST=localhost`, `DB_USER=root`, `DB_PASSWORD=password`, `DB_NAME=city_info` (configured in `backend/.env`).
    -   If your credentials differ, update the `.env` file in the `backend/` directory.

2.  **Initialize Database:**
    ```bash
    cd backend
    npm install
    npm run db:create
    npm run db:migrate
    npm run db:seed
    cd ..
    ```

### Running the Application

**Recommended Method (Concurrent):**
Run both backend and frontend with a single command.

```bash
npm install          # Install root dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..
npm run dev          # Runs backend (port 5000) + frontend (port 5173)
```
The browser will automatically open to http://localhost:5173.

**Run Separately:**
-   **Backend:** `cd backend && npm run dev` → http://localhost:5000
-   **Frontend:** `cd frontend && npm run dev` → http://localhost:5173

## Features

-   **Cities:** Browse detailed information about major cities.
-   **Authentication:**
    -   User Registration & Login (User/Admin roles).
    -   **Forgot Password:** Secure flow with Email OTP verification.
-   **Blog:** Read community posts. Admins can create new blog entries.
-   **Admin Dashboard:** Manage content (Admin account: `admin@example.com` / `admin123`).
-   **Info:** About page with site details.

## Technologies

-   **Frontend:** React 18, TypeScript, Vite, React Router v6, Context API, CSS Modules.
-   **Backend:** Node.js, Express, TypeScript, MySQL2, Nodemailer (for emails).
-   **Database:** MySQL.
# simple-login
