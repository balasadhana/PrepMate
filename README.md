# Prepmate - Resume Builder

A comprehensive MERN stack application for building professional resumes with multiple templates and PDF export functionality.

## Features

### Resume Builder
- **Multiple Professional Templates**: Choose from 4 different resume designs
  - Professional: Clean and modern design suitable for corporate positions
  - Creative: Colorful and creative design for creative industries
  - Minimal: Simple and minimal design focusing on content
  - Technical: Technical-focused design for IT and engineering roles

- **Comprehensive Form Sections**:
  - Personal Information (Name, Email, Phone, LinkedIn)
  - Education (Degree, Institution, Year, GPA)
  - Work Experience (Title, Company, Duration, Description)
  - Skills (Categorized skill groups)
  - Projects (Title, Description, Technologies, Links)
  - Certifications

- **Real-time Preview**: Preview your resume as you build it
- **Template Switching**: Change templates on the fly to see different designs
- **Auto-save**: Automatically saves your progress to MongoDB

### Resume Preview & Export
- **Live Preview**: See your resume in the selected template format
- **Template Selection**: Switch between different templates in preview mode
- **PDF Download**: Generate high-quality PDF versions of your resume
- **Print Support**: Print-friendly templates with proper formatting
- **Multiple Formats**: Download the same resume in different template styles

### Admin Features
- **User Management**: Manage user accounts and permissions
- **Content Approval**: Review and approve user-submitted experiences
- **Template Management**: Upload and manage resume templates
- **Analytics Dashboard**: View usage statistics and user engagement

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **RESTful API Architecture**

### Frontend
- **React 19** with modern hooks
- **Responsive Design** with CSS Grid and Flexbox
- **PDF Generation** using jsPDF and html2canvas
- **Real-time Updates** with Axios HTTP client

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup
```bash
cd server
npm install
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

### Environment Variables
Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## API Endpoints

### Resume Management
- `POST /api/resumes` - Create a new resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get resume by ID
- `GET /api/resumes/user/:email` - Get resumes by user email

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## Usage Guide

### Creating a Resume
1. **Select Template**: Choose from 4 professional templates
2. **Fill Information**: Complete all relevant sections
3. **Preview**: Click "Preview Resume" to see the final result
4. **Save**: Save your resume to your account
5. **Export**: Download as PDF or print

### Template Features
- **Professional**: Ideal for corporate and business positions
- **Creative**: Perfect for design, marketing, and creative roles
- **Minimal**: Clean and simple for traditional industries
- **Technical**: Optimized for IT, engineering, and technical roles

### PDF Export
- High-quality PDF generation
- Automatic page breaks for long resumes
- Print-optimized formatting
- Customizable filenames with date stamps

## File Structure

```
prepmate/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ResumeTemplate.jsx    # Resume template components
│   │   │   └── ResumePreview.jsx     # Preview and PDF export
│   │   ├── pages/         # Page components
│   │   │   └── user/
│   │   │       └── ResumeBuilder.jsx # Main resume builder
│   │   └── styles/        # CSS stylesheets
├── server/                 # Node.js backend
│   ├── models/            # MongoDB schemas
│   │   └── ResumePublic.js # Resume data model
│   ├── routes/            # API routes
│   │   └── resumesPublic.js # Resume API endpoints
│   └── server.js          # Express server
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository. 