# 📘 MoodSnap – Role-Based Mood Tracking System

## 🧠 Project Overview
MoodSnap is a lightweight full-stack web application that allows users to track their daily moods. It implements Role-Based Access Control (RBAC) to differentiate between User and Admin functionalities.

This project focuses on core functionality, clean UI, and full-stack integration.

---

## 🎯 Objectives
- Build a minimal mood tracking system  
- Implement role-based access (User vs Admin)  
- Connect frontend and backend using REST APIs  
- Demonstrate full-stack development (Next.js + FastAPI + MongoDB)  

---

## 🧱 Tech Stack
- Frontend: Next.js + Tailwind CSS  
- Backend: FastAPI (Python)  
- Database: MongoDB Atlas  
- Auth: Basic Role-Based Logic  

---

## 👥 User Roles & Permissions

### 👤 User
**Can:**
- Create mood entries  
- View own mood history  
- View personal statistics  

**Cannot:**
- View other users’ data  
- Delete entries  
- Access admin features  

---

### 🛠️ Admin
**Can:**
- View all mood entries  
- View global statistics  
- Delete any mood entry  
- View user list  

---

## 🔐 Authentication
- Login with Username and Role selection  
- Stored in localStorage (frontend)  
- Backend validates role via request  

⚠️ Note: This is mock authentication (no JWT used)

---

## 😊 Features
- Emoji-based mood selection 😊😐😡😢  
- Optional note with timestamp  
- Timeline view (User: last 10, Admin: all)  
- Mood statistics (User: personal, Admin: global)  
- Admin controls for deleting entries and viewing users  

---

## 🗂️ Project Structure
MoodSnap/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── moods.py
│   │   └── stats.py
│   ├── schemas/
│   │   └── mood_schema.py
│   └── utils/
│       └── role_checker.py
│
├── frontend/
│   ├── app/
│   │   ├── login/page.jsx
│   │   ├── dashboard/page.jsx
│   │   ├── layout.js
│   │   ├── globals.css
│   │   └── page.jsx
│   ├── components/
│   │   ├── MoodForm.jsx
│   │   ├── TimelineList.jsx
│   │   └── StatsPanel.jsx
│   ├── services/api.js
│   └── utils/auth.js
│
└── README.md

---

## 🔌 API Endpoints
Base URL: /api

Auth:
POST /api/auth/login

Mood:
POST   /api/moods  
GET    /api/moods  
DELETE /api/moods/{id}

Stats:
GET /api/stats

---

## ⚙️ Setup Instructions

### Backend
cd backend  
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt  

Create .env:
MONGO_URL=your_mongodb_connection_string  

Run server:
uvicorn main:app --reload  

---

### Frontend
cd frontend  
npm install  
npm run dev  

---

## 🌐 Deployment

Backend (Render):
Build Command:
pip install -r requirements.txt  

Start Command:
uvicorn main:app --host 0.0.0.0 --port 10000  

Frontend:
Update API base URL in services/api.js:
baseURL: "https://your-backend-url.onrender.com/api"

---

## 🎨 UI Features
- Clean centered layout  
- Responsive design  
- Modern login page  
- Emoji-based interactions  
- Role-based dashboard  

---

## ⏱️ Constraints
- Development time: ~2 hours  
- Focus on core functionality, clean UI, working integration  

---

## ⚠️ Assumptions
- No secure authentication  
- Role selected manually  
- Minimal validation  

---

## 🚀 Future Enhancements
- JWT Authentication  
- Charts (Recharts / Chart.js)  
- Real-time updates  
- AI-based mood insights  

---

## ✅ Final Outcome
- Users can track moods  
- Admin can manage all entries  
- Role-based access is enforced  
- Full-stack integration works successfully  

---

## 👨‍💻 Author
Rohith P  
Full Stack Developer (MERN + FastAPI)