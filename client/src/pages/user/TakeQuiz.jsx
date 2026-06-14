import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/TakeQuiz.css';

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const domains = ['All', 'DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'];

  // Fetch quizzes from backend
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/quizzes');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setQuizzes(response.data.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response format from server');
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to fetch quizzes. Please try again later.');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzesByDomain = async (domain) => {
    if (domain === 'All') {
      fetchQuizzes();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/quizzes/${domain}`);
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setQuizzes(response.data.data);
      } else {
        console.error('Invalid domain response format:', response.data);
        setError('Invalid response format from server');
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Error fetching quizzes by domain:', err);
      setError('Failed to fetch quizzes for this domain. Please try again later.');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    fetchQuizzesByDomain(domain);
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setTotalQuestions(1); // Each quiz item is one question
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const submitQuiz = () => {
    if (!currentQuiz) return;

    let correctAnswers = 0;
    const total = 1; // Each quiz item is one question

    // Get the user's selected answer
    const userAnswer = userAnswers[currentQuiz._id];
    
    // Find the index of the user's answer in the options array
    const userAnswerIndex = currentQuiz.options.indexOf(userAnswer);
    const userAnswerLabel = getOptionLabel(userAnswerIndex); // Convert to A, B, C, D
    
    // Check if user's answer label matches correct answer
    if (userAnswerLabel === currentQuiz.correctAnswer) {
      correctAnswers++;
    }

    const finalScore = Math.round((correctAnswers / total) * 100);
    setScore(finalScore);
    setTotalQuestions(total);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setTotalQuestions(0);
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  if (loading) {
    return (
      <div className="take-quiz">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="take-quiz">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchQuizzes} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    return (
      <div className="take-quiz">
        <div className="quiz-header">
          <h1>Quiz: {currentQuiz.domain}</h1>
          <p>Question 1 of 1</p>
        </div>

        <div className="quiz-question-container">
          <div className="question-card">
            <h3 className="question-text">{currentQuiz.question}</h3>
            
            <div className="options-container">
              {currentQuiz.options.map((option, index) => (
                <label key={index} className="option-item">
                  <input
                    type="radio"
                    name={`question-${currentQuiz._id}`}
                    value={option}
                    checked={userAnswers[currentQuiz._id] === option}
                    onChange={() => handleAnswerSelect(currentQuiz._id, option)}
                  />
                  <span className="option-label">{getOptionLabel(index)}</span>
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>

            {!quizSubmitted && (
              <div className="quiz-actions">
                <button 
                  className="submit-btn"
                  onClick={submitQuiz}
                  disabled={!userAnswers[currentQuiz._id]}
                >
                  Submit Answer
                </button>
                <button className="back-btn" onClick={resetQuiz}>
                  Back to Quiz List
                </button>
              </div>
            )}

            {quizSubmitted && (
              <div className="quiz-result">
                <div className="result-header">
                  <h2>Quiz Completed!</h2>
                  <div className="score-display">
                    Your Score: <span className="score">{score}%</span>
                  </div>
                  <p>You got {score === 100 ? 'all' : score === 0 ? 'none' : 'some'} questions correct out of {totalQuestions}</p>
                </div>
                
                <div className="answer-review">
                  <h3>Answer Review:</h3>
                  <div className="answer-item">
                    <p><strong>Your Answer:</strong> {userAnswers[currentQuiz._id] || 'No answer selected'}</p>
                    <p><strong>Correct Answer:</strong> {currentQuiz.correctAnswer} ({currentQuiz.options[currentQuiz.correctAnswer.charCodeAt(0) - 65]})</p>
                    <p className={`result-status ${score === 100 ? 'correct' : 'incorrect'}`}>
                      {score === 100 ? '✅ Correct!' : '❌ Incorrect'}
                    </p>
                  </div>
                </div>

                <div className="quiz-actions">
                  <button className="retake-btn" onClick={resetQuiz}>
                    Take Another Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="take-quiz">
      <div className="quiz-header">
        <h1>Take Quiz</h1>
        <p>Test your knowledge with our comprehensive interview preparation quizzes</p>
      </div>

      {/* Quiz Stats */}
      {!loading && (
        <div className="quiz-stats">
          <div className="stat-item">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Total Questions</h3>
              <p>{quizzes?.length || 0}</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <h3>Domains</h3>
              <p>{quizzes && quizzes.length > 0 ? new Set(quizzes.map(q => q.domain)).size : 0}</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Contributors</h3>
              <p>{quizzes && quizzes.length > 0 ? new Set(quizzes.map(q => q.createdBy?.username || 'Admin')).size : 0}</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Latest</h3>
              <p>{quizzes && quizzes.length > 0 ? new Date(quizzes[0].createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      {!loading && (
        <div className="filter-section">
          <div className="filter-group">
            <label>Domain:</label>
            <select 
              value={selectedDomain} 
              onChange={(e) => handleDomainChange(e.target.value)}
              className="filter-select"
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Quiz Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
      ) : !quizzes || quizzes.length === 0 ? (
        <div className="no-quizzes">
          <h3>No quizzes available</h3>
          <p>Check back later for new quizzes or try a different domain.</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-header-card">
                <h3>{quiz.domain} Quiz</h3>
                <div className="quiz-meta">
                  <span className="domain-badge">
                    {quiz.domain}
                  </span>
                </div>
              </div>

              <div className="quiz-details">
                <div className="detail-item">
                  <span className="detail-label">❓ Question:</span>
                  <span className="question-preview">
                    {quiz.question && quiz.question.length > 100 
                      ? quiz.question.substring(0, 100) + '...' 
                      : quiz.question || 'Question not available'
                    }
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🔢 Options:</span>
                  <span>{quiz.options && Array.isArray(quiz.options) ? quiz.options.length : 0} choices</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👤 Created by:</span>
                  <span>{quiz.createdBy?.username || 'Admin'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Date:</span>
                  <span>{quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="quiz-actions">
                <button 
                  className="start-btn"
                  onClick={() => startQuiz(quiz)}
                >
                  <span className="btn-icon">▶️</span>
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Start Section */}
      {!loading && (
        <div className="quick-start-section">
          <h2>Quick Start</h2>
          <div className="quick-start-grid">
            {quizzes && quizzes.length > 0 ? (
              quizzes.slice(0, 3).map((quiz, index) => (
                <button 
                  key={quiz._id}
                  className="quick-start-btn"
                  onClick={() => startQuiz(quiz)}
                >
                  <span className="quick-icon">🎯</span>
                  <div className="quick-content">
                    <h3>{quiz.domain || 'Quiz'} Quiz</h3>
                    <p>{quiz.question && quiz.question.length > 50 ? quiz.question.substring(0, 50) + '...' : quiz.question || 'Question not available'}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="no-quick-start">
                <p>No quizzes available for quick start</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz; 