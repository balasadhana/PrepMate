import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/TakeQuiz.css';

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [currentQuiz, setCurrentQuiz] = useState(null); // { domain, questions: [] }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
      const response = await axios.get('https://prepmate-backend-wy02.onrender.com/api/quizzes');
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
      const response = await axios.get(`https://prepmate-backend-wy02.onrender.com/api/quizzes/${domain}`);
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

  const startQuiz = (domainName, domainQuestions) => {
    setCurrentQuiz({
      domain: domainName,
      questions: domainQuestions
    });
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setTotalQuestions(domainQuestions.length);
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
    const total = currentQuiz.questions.length;

    // Check answers for all questions in the quiz
    currentQuiz.questions.forEach(q => {
      const userAnswer = userAnswers[q._id];
      const userAnswerIndex = q.options.indexOf(userAnswer);
      const userAnswerLabel = getOptionLabel(userAnswerIndex); // Convert to A, B, C, D

      if (userAnswerLabel === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / total) * 100);
    setScore(finalScore);
    setTotalQuestions(total);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setTotalQuestions(0);
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  // Group active quizzes by domain
  const getGroupedQuizzes = () => {
    const grouped = {};
    quizzes.forEach(quiz => {
      if (!grouped[quiz.domain]) {
        grouped[quiz.domain] = [];
      }
      grouped[quiz.domain].push(quiz);
    });
    return grouped;
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
    const activeQuestion = currentQuiz.questions[currentQuestionIndex];
    return (
      <div className="take-quiz">
        <div className="quiz-header">
          <h1>Quiz: {currentQuiz.domain}</h1>
          <p>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
        </div>

        <div className="quiz-question-container">
          <div className="question-card">
            <h3 className="question-text">{activeQuestion.question}</h3>

            <div className="options-container">
              {activeQuestion.options.map((option, index) => (
                <label key={index} className="option-item">
                  <input
                    type="radio"
                    name={`question-${activeQuestion._id}`}
                    value={option}
                    checked={userAnswers[activeQuestion._id] === option}
                    onChange={() => handleAnswerSelect(activeQuestion._id, option)}
                  />
                  <span className="option-label">{getOptionLabel(index)}</span>
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>

            {!quizSubmitted && (
              <div className="quiz-actions">
                {currentQuestionIndex > 0 && (
                  <button className="back-btn" onClick={() => setCurrentQuestionIndex(prev => prev - 1)}>
                    Previous Question
                  </button>
                )}

                {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                  <button
                    className="next-btn"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    disabled={!userAnswers[activeQuestion._id]}
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    className="submit-btn"
                    onClick={submitQuiz}
                    disabled={!userAnswers[activeQuestion._id]}
                  >
                    Submit Quiz
                  </button>
                )}

                <button className="back-btn outline" style={{ background: '#e11d48' }} onClick={resetQuiz}>
                  Exit Quiz
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
                  <p>You got {Math.round((score / 100) * totalQuestions)} questions correct out of {totalQuestions}</p>
                </div>

                <div className="answer-review">
                  <h3>Answer Review:</h3>
                  {currentQuiz.questions.map((q, idx) => {
                    const userAnswer = userAnswers[q._id];
                    const userAnswerIndex = q.options.indexOf(userAnswer);
                    const userAnswerLabel = getOptionLabel(userAnswerIndex);
                    const isCorrect = userAnswerLabel === q.correctAnswer;
                    const correctAnswerText = q.options[q.correctAnswer.charCodeAt(0) - 65];

                    return (
                      <div key={q._id} className="answer-item" style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', textAlign: 'left' }}>
                        <p style={{ fontWeight: 600, color: '#1e293b' }}><strong>Question {idx + 1}:</strong> {q.question}</p>
                        <p><strong>Your Answer:</strong> {userAnswer || 'No answer selected'}</p>
                        <p><strong>Correct Answer:</strong> {q.correctAnswer}: {correctAnswerText}</p>
                        <p className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                        </p>
                        {q.explanation && (
                          <p style={{ marginTop: '8px', color: '#64748b', fontStyle: 'italic' }}>
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
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

  const groupedQuizzes = getGroupedQuizzes();

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
              <h3>Topics</h3>
              <p>{Object.keys(groupedQuizzes).length}</p>
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
            <label>Topic / Domain:</label>
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
      ) : Object.keys(groupedQuizzes).length === 0 ? (
        <div className="no-quizzes">
          <h3>No quizzes available</h3>
          <p>Check back later for new quizzes or try a different domain.</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {Object.entries(groupedQuizzes).map(([domainName, domainQuestions]) => (
            <div key={domainName} className="quiz-card">
              <div className="quiz-header-card">
                <h3>{domainName} Practice Quiz</h3>
                <div className="quiz-meta">
                  <span className="domain-badge">
                    {domainName}
                  </span>
                </div>
              </div>

              <div className="quiz-details">
                <div className="detail-item">
                  <span className="detail-label">❓ Questions:</span>
                  <span>{domainQuestions.length} Questions</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👤 Contributors:</span>
                  <span>{new Set(domainQuestions.map(q => q.createdBy?.username || 'Admin')).size} Contributors</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Latest Update:</span>
                  <span>{new Date(Math.max(...domainQuestions.map(q => new Date(q.createdAt)))).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="quiz-actions">
                <button
                  className="start-btn"
                  onClick={() => startQuiz(domainName, domainQuestions)}
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
            {Object.keys(groupedQuizzes).length > 0 ? (
              Object.entries(groupedQuizzes).slice(0, 3).map(([domainName, domainQuestions]) => (
                <button
                  key={domainName}
                  className="quick-start-btn"
                  onClick={() => startQuiz(domainName, domainQuestions)}
                >
                  <span className="quick-icon">🎯</span>
                  <div className="quick-content">
                    <h3>{domainName} Quiz</h3>
                    <p>{domainQuestions.length} practice questions available</p>
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