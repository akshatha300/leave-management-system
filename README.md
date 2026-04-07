# University Management System (UMS) - Leave Portal

A full-stack, enterprise-grade Leave Management System (LMS) designed for academic institutions. Featuring a strict hierarchical approval workflow, real-time analytics, and a premium Glassmorphism UI.

## 🚀 Key Features

- **Hierarchical Approval Flow**: 
  - `Student` ➔ `Professor` ➔ `HOD` ➔ `Principal`
- **Role-Based Dashboards**: Tailored experiences for each member of the university hierarchy.
- **Public Sign-Up**: Intelligent registration with departmental supervisor mapping.
- **Real-Time Analytics**: Live data visualization on leave distributions and administrative workload.
- **Cloud-Ready**: Fully integrated with MongoDB Atlas and optimized for Render/Vercel deployment.
- **Premium UI/UX**: Built with React, Tailwind CSS, and Shadcn UI, featuring Glassmorphism and responsive animations.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Redux Toolkit, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, JWT Authentication, Mongoose.
- **Database**: MongoDB Atlas (Cloud).
- **Styling**: Tailwind CSS + Shadcn UI.

## 📁 Project Structure

- `/leave-management-system`: The React frontend application.
- `/leave-management-backend`: The Express.js API server.
- `.gitignore`: root-level security for environment variables.

## 🏁 Quick Start

### 1. Backend Setup
1. Navigate to `leave-management-backend`.
2. Run `npm install`.
3. Create a `.env` file (see `.env.example`).
4. Run `node src/seed.js` to initialize the hierarchy.
5. Run `npm run dev`.

### 2. Frontend Setup
1. Navigate to `leave-management-system`.
2. Run `npm install`.
3. Run `npm run dev`.

## 📜 Approval Logic
The system enforces a **1:1 supervisor relationship**. When a user signs up, they pick their supervisor based on their role:
- **Students** must be approved by a **Professor** in their department.
- **Professors** must be approved by their **HOD**.
- **HODs** are approved by the **Principal**.

---

## 🌎 Deployment
Refer to the [Deployment Guide](file:///c:/Users/Akshatha.j/.gemini/antigravity/brain/c647bc86-39c8-4936-9958-7e75ad636441/artifacts/deployment_guide.md) in the artifacts for instructions on hosting on Render and Vercel.

---
Built with ❤️ for University Administration.
