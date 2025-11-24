# 🕒 Time Stat – Student Attendance Tracking System

A complete student attendance tracking system with backend API, PDF/Excel export, and a modern **Next.js frontend interface**.  

---

## ✨ Features

- 📝 Record daily student attendance
- 👀 View history and details per student
- 📊 Monthly/Yearly summary report
- 📄 Export PDF
- 📁 Export Excel
- 🎨 Clean UI with animations
- ⚙️ Separate Backend API & Frontend App

---

## 🚀 Tech Stack

**Frontend**

- Next.js 15
- Tailwind CSS + DaisyUI

**Backend**

- Node.js (Express)
- Prisma ORM
- TiDB / MySQL
- PDFKit
- Exceljs

---

## ⚙️ Installation Guide

### 1. Clone & Install Backend

Download the backend from the repository below:

🔗 [Backend Repository](https://github.com/Saksit75/time-stat-api2)

Follow the backend README to:

- Install dependencies
- Configure `.env`
- Set up the database
- Run Prisma migration
- Start the backend server

---

### 2. Configure Frontend

Create a `.env` file at the root of your frontend project:


`NEXT_PUBLIC_API_URL="<YOUR_BACKEND_API_URL>"`

Example:

NEXT_PUBLIC_API_URL="http://localhost:5000"

### 3. Install Packages

Install all dependencies for the frontend project:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```


### 4. Run Frontend Development Server

Use any package manager:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open your browser at:
🔗 http://localhost:3000
