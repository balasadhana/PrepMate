# 🚀 PrepMate - Interview Preparation Platform

PrepMate is a comprehensive MERN Stack-based Interview Preparation Platform designed to help students and job seekers prepare for placements and technical interviews effectively.

The platform provides study materials, aptitude and technical quizzes, interview experience sharing, resume building, career guidance resources, and progress tracking in a single application.

---

## 📌 Key Features

### 👤 User Features

- Secure User Registration and Login using JWT Authentication
- Personalized User Dashboard
- Resume Builder with PDF Download Support
- Interview Question Bank
- Online Quiz and Assessment System
- Study Materials Access and Download
- Interview Experience Sharing
- Career Tips and Learning Resources
- Progress Tracking and Performance Monitoring
- User Profile Management

---

### 🛠️ Admin Features

- Admin Dashboard
- User Management
- Quiz Management
- Study Material Upload and Management
- Tips and Resources Management
- Interview Experience Approval System
- Analytics and Platform Monitoring

---

## 🎯 Project Modules

### Authentication Module
- User Registration
- User Login
- JWT-Based Authentication
- Protected Routes

### Resume Builder Module
- Professional Resume Creation
- Multiple Resume Sections
- PDF Export Functionality

### Quiz Module
- Aptitude and Technical Quizzes
- Score Calculation
- Performance Evaluation
- Progress Tracking

### Study Material Module
- Learning Resource Management
- Material Upload and Download
- Categorized Study Content

### Experience Sharing Module
- Share Interview Experiences
- Experience Approval Workflow
- Community Learning Support

### Career Resources Module
- Interview Preparation Tips
- Career Guidance Content
- Learning Resources

---

## 💻 Technology Stack

### Frontend
- React.js
- React Router DOM
- Axios
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- REST API Architecture
- JWT Authentication

### Database
- MongoDB
- Mongoose ODM

### Additional Libraries
- jsPDF
- html2canvas

---



## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v16 or above)
- MongoDB Atlas or Local MongoDB
- npm

---

### Clone Repository

```bash
git clone https://github.com/balasadhana/PrepMate.git
```

---

### Backend Setup

```bash
cd server
npm install
npm start
```

---

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📡 API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### User

- GET /api/user/profile
- PUT /api/user/profile

### Quizzes

- GET /api/quizzes
- POST /api/quizzes

### Study Materials

- GET /api/materials
- POST /api/materials

### Experiences

- GET /api/experiences
- POST /api/experiences

### Resume Builder

- GET /api/resumes
- POST /api/resumes

---

## 🚀 Future Enhancements

- AI-Based Mock Interview System
- Interview Performance Analytics
- Company-Specific Question Banks
- Email Notifications
- Online Coding Assessments
- Interview Scheduling System

---

## 👩‍💻 Author

**Sadhana Bala**

- Full Stack MERN Developer
- GitHub: https://github.com/balasadhana
- Project: PrepMate – Interview Preparation Platform
---
## 📂 Project Structure

```text
PrepMate
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── UserLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── FeatureCard.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminManageUsersPage.jsx
│   │   │   ├── AdminQuizManagementPage.jsx
│   │   │   ├── AdminMaterialsUploadPage.jsx
│   │   │   ├── AdminTipsUploadPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── user
│   │   │       ├── UserDashboard.jsx
│   │   │       ├── ResumeBuilder.jsx
│   │   │       ├── ShareExperience.jsx
│   │   │       ├── StudyMaterial.jsx
│   │   │       ├── TakeQuiz.jsx
│   │   │       └── Tips.jsx
│   │   │
│   │   ├── styles
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── server
│   ├── models
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Quiz.js
│   │   ├── Material.js
│   │   ├── Experience.js
│   │   ├── Resume.js
│   │   ├── ResumeTemplate.js
│   │   └── Tip.js
│   │
│   ├── routes
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── user.js
│   │   ├── quizzes.js
│   │   ├── materials.js
│   │   ├── experiences.js
│   │   └── tips.js
│   │
│   ├── uploads
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 📜 License

This project is developed for educational, learning, and portfolio purposes.

---

## ⭐ Support

If you find this project useful, consider giving it a star on GitHub.
