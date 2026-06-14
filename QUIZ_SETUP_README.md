# Quiz Functionality Setup Guide

This guide explains how to set up and test the quiz functionality for the Prepmate MERN stack application.

## Overview

The quiz system allows admins to:
- Create individual quiz questions through the admin interface
- Set questions as Active/Inactive
- Manage questions by domain (DBMS, DSA, Frontend, Backend, System Design, Other)

Users can:
- View active quizzes uploaded by admins
- Filter quizzes by domain
- Take individual quiz questions with multiple choice options
- Submit answers and see their score
- Review correct answers

## Backend Implementation

### 1. Quiz Model (`server/models/Quiz.js`)
- **Fields**: `question`, `options`, `correctAnswer`, `domain`, `createdBy`, `status`
- **Domain Options**: DBMS, DSA, Frontend, Backend, System Design, Other
- **Status Options**: Active, Inactive
- **Validation**: Required fields with proper data types

### 2. Quiz Routes (`server/routes/quizzes.js`)
- `GET /api/quizzes` - Fetch all active quizzes
- `GET /api/quizzes/:domain` - Fetch active quizzes by specific domain
- **Features**: 
  - Only returns Active quizzes
  - Populates creator information
  - Sorts by creation date
  - Domain validation
  - Error handling

### 3. Admin Quiz Routes (`server/routes/admin.js`)
- `POST /api/quizzes` - Create new quiz question
- `GET /api/quizzes` - Fetch all quizzes (admin view)
- `PUT /api/quizzes/:id` - Update quiz question
- `DELETE /api/quizzes/:id` - Delete quiz question
- `PATCH /api/quizzes/:id` - Update quiz status (Active/Inactive)

### 4. Server Integration (`server/server.js`)
- Quiz routes are mounted at `/api/quizzes`
- Admin routes are mounted at `/api/admin`
- CORS is enabled for frontend communication
- MongoDB connection to PrepmateDB

## Frontend Implementation

### 1. AdminQuizManagementPage (`client/src/pages/AdminQuizManagementPage.jsx`)
- **Quiz Creation**: Form to create individual quiz questions
- **Quiz Management**: View, edit, delete, and toggle status of quiz questions
- **Analytics**: Domain distribution and quiz statistics
- **Features**: 
  - Create questions with 4 options
  - Set correct answer from options
  - Choose domain and add explanations
  - Toggle Active/Inactive status

### 2. TakeQuiz Component (`client/src/pages/user/TakeQuiz.jsx`)
- **State Management**: Quizzes, loading, error, current quiz, user answers
- **API Integration**: Uses axios to fetch active quizzes from backend
- **Quiz Flow**: 
  - Display active quiz list with domain filtering
  - Start individual quiz questions
  - Multiple choice answer selection
  - Submit and score calculation
  - Answer review and results

### 3. Styling (`client/src/styles/TakeQuiz.css`)
- Responsive design with modern UI
- Loading states and error handling
- Quiz question and option styling
- Results display styling

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```

### 2. Frontend Setup
```bash
cd client
npm install
```

### 3. Database Setup
Ensure MongoDB is running and accessible at `mongodb://localhost:27017/PrepmateDB`

### 4. Environment Variables
Create `.env` file in server directory:
```env
MONGO_URI=mongodb://localhost:27017/PrepmateDB
PORT=5000
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

## Testing the Quiz Functionality

### 1. Admin Quiz Creation
1. Navigate to the admin quiz management page
2. Use the "Create New Quiz Question" form to add questions
3. Fill in:
   - Question text
   - Domain selection
   - 4 multiple choice options
   - Correct answer (must match one of the options)
   - Optional explanation
4. Click "Create Quiz Question"

### 2. User Quiz Taking
1. Navigate to `/take-quiz` in your React application
2. The page will display all active quizzes created by admins
3. Use the domain dropdown to filter quizzes
4. Click "Start Quiz" on any quiz question
5. Select an answer and click "Submit Answer"
6. View your score and review the correct answer

### 3. Test the System
Run the test script to verify everything works:
```bash
cd server
node test-admin-quiz.js
```

## API Endpoints

### User Endpoints (Public)
```
GET http://localhost:5000/api/quizzes
GET http://localhost:5000/api/quizzes/DBMS
```

### Admin Endpoints
```
POST http://localhost:5000/api/quizzes
GET http://localhost:5000/api/admin/quizzes
PUT http://localhost:5000/api/admin/quizzes/:id
DELETE http://localhost:5000/api/admin/quizzes/:id
PATCH http://localhost:5000/api/admin/quizzes/:id
```

## Quiz Data Structure

Each quiz question contains:
```json
{
  "_id": "unique_id",
  "question": "What is the primary key in a database?",
  "options": [
    "A field that uniquely identifies each record",
    "A field that stores text data",
    "A field that stores numeric data",
    "A field that stores date data"
  ],
  "correctAnswer": "A field that uniquely identifies each record",
  "domain": "DBMS",
  "explanation": "A primary key uniquely identifies each record...",
  "status": "Active",
  "createdBy": "admin_user_id",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Features

- ✅ **Admin-Driven**: Admins create individual quiz questions
- ✅ **Status Management**: Active/Inactive quiz status control
- ✅ **Real-time Data**: Fetches quizzes from MongoDB
- ✅ **Domain Filtering**: Filter quizzes by specific domains
- ✅ **Interactive Quiz Taking**: Multiple choice with radio buttons
- ✅ **Score Calculation**: Automatic scoring based on correct answers
- ✅ **Answer Review**: Shows user answer vs. correct answer
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Error Handling**: Graceful error states and retry functionality
- ✅ **Loading States**: User feedback during API calls

## Admin Workflow

1. **Access Admin Panel**: Navigate to admin quiz management
2. **Create Questions**: Use the form to add new quiz questions
3. **Set Domain**: Choose appropriate domain for each question
4. **Manage Status**: Toggle questions between Active/Inactive
5. **Monitor Analytics**: View question distribution and statistics

## User Workflow

1. **Browse Quizzes**: View available active quiz questions
2. **Filter by Domain**: Select specific domains of interest
3. **Take Quizzes**: Start individual quiz questions
4. **Submit Answers**: Select and submit your answer
5. **Review Results**: See score and correct answer explanation

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **CORS Error**
   - Backend CORS is enabled
   - Frontend proxy is set to `http://localhost:5000`

3. **No Quizzes Displayed**
   - Create quiz questions through admin interface
   - Ensure questions are set to "Active" status
   - Check browser console for API errors

4. **Quiz Not Starting**
   - Ensure all required fields are present in quiz data
   - Check browser console for JavaScript errors

5. **Admin Quiz Creation Fails**
   - Verify all required fields are filled
   - Ensure correct answer matches one of the options
   - Check server logs for validation errors

### Debug Commands

```bash
# Test admin quiz creation
cd server && node test-admin-quiz.js

# Check MongoDB connection
mongo PrepmateDB --eval "db.quizzes.find().pretty()"

# Check server logs
cd server && npm start

# Check client logs
cd client && npm start
```

## Future Enhancements

- Quiz difficulty levels
- User progress tracking
- Quiz performance analytics
- Bulk quiz import/export
- Quiz categories and tags
- Social sharing of results
- Quiz recommendations based on user performance
