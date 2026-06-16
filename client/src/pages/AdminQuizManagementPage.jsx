import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminQuizManagementPage.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminQuizManagementPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' or 'analytics'
  const [message, setMessage] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    domainDistribution: {
      labels: [],
      datasets: []
    },
    quizStats: {
      totalQuizzes: 0,
      totalDomains: 0,
      averageQuestions: 0
    }
  });

  // Selected domain for batch quiz creation
  const [selectedDomain, setSelectedDomain] = useState('');
  
  // Quiz form state supporting multiple questions
  const [questionsList, setQuestionsList] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    }
  ]);

  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/admin'
    : 'https://prepmate-backend-wy02.onrender.com/api/admin';

  // Predefined domains
  const domains = ['DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'];

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Update analytics when quizzes change
  useEffect(() => {
    generateAnalytics();
  }, [quizzes]);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/quizzes`);
      if (Array.isArray(response.data)) {
        setQuizzes(response.data);
      } else if (response.data && response.data.success) {
        setQuizzes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setMessage('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  // Generate analytics data
  const generateAnalytics = () => {
    const domainCounts = {};
    quizzes.forEach(quiz => {
      domainCounts[quiz.domain] = (domainCounts[quiz.domain] || 0) + 1;
    });

    const domainLabels = Object.keys(domainCounts);
    const domainData = Object.values(domainCounts);

    // Modern color palette for domains
    const domainColors = {
      'DBMS': '#6366f1',          // Indigo
      'DSA': '#0ea5e9',           // Sky Blue
      'Frontend': '#f43f5e',      // Rose Pink
      'Backend': '#10b981',       // Emerald Green
      'System Design': '#8b5cf6', // Violet/Purple
      'Other': '#f59e0b'          // Amber/Gold
    };

    // Fallback colors if domain is not predefined
    const defaultColors = ['#6366f1', '#0ea5e9', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b'];
    const backgroundColors = domainLabels.map((domain, index) => domainColors[domain] || defaultColors[index % defaultColors.length]);

    setAnalyticsData({
      domainDistribution: {
        labels: domainLabels,
        datasets: [{
          label: 'Quizzes per Domain',
          data: domainData,
          backgroundColor: backgroundColors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      quizStats: {
        totalQuizzes: quizzes.length,
        totalDomains: domainLabels.length,
        averageQuestions: quizzes.length > 0 ? Math.round(quizzes.length / domainLabels.length) : 0
      }
    });
  };

  // Add a new question block to the form
  const addQuestionBlock = () => {
    setQuestionsList(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: ''
      }
    ]);
  };

  // Remove a question block by index
  const removeQuestionBlock = (index) => {
    if (questionsList.length === 1) {
      setMessage("You must keep at least one question block.");
      return;
    }
    setQuestionsList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Handle updates to question text, correct answer, or explanation
  const handleQuestionChange = (qIndex, field, value) => {
    setQuestionsList(prev => prev.map((q, idx) => {
      if (idx !== qIndex) return q;
      return { ...q, [field]: value };
    }));
  };

  // Handle updates to options array inside a question block
  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuestionsList(prev => prev.map((q, idx) => {
      if (idx !== qIndex) return q;
      const newOptions = [...q.options];
      newOptions[oIndex] = value;
      return { ...q, options: newOptions };
    }));
  };

  // Handle submission of all questions in the batch
  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDomain) {
      setMessage('Please select a domain');
      return;
    }

    // Validate all questions in the list
    for (let i = 0; i < questionsList.length; i++) {
      const q = questionsList[i];
      if (!q.question.trim()) {
        setMessage(`Please fill in the question text for Question ${i + 1}`);
        return;
      }
      if (q.options.some(option => !option.trim())) {
        setMessage(`Please fill in all four options for Question ${i + 1}`);
        return;
      }
      if (!q.correctAnswer) {
        setMessage(`Please select the correct answer for Question ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);

      // Map questionsList items to API structure
      const payload = questionsList.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        domain: selectedDomain,
        explanation: q.explanation || ''
      }));

      await axios.post(`${API_BASE_URL}/quizzes`, payload);

      const count = questionsList.length;
      setMessage(`${count} quiz question${count > 1 ? 's' : ''} created successfully!`);
      
      // Reset form states
      setQuestionsList([
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: ''
        }
      ]);
      setSelectedDomain('');
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error creating quiz:', error);
      setMessage(error.response?.data?.error || 'Failed to create quiz questions');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz deletion
  const handleQuizDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz question?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/quizzes/${quizId}`);
      setMessage('Quiz question deleted successfully!');
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setMessage('Failed to delete quiz question');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz status toggle
  const handleStatusToggle = async (quizId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.patch(`${API_BASE_URL}/quizzes/${quizId}`, { status: newStatus });
      setMessage(`Quiz status updated to ${newStatus}`);
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error updating quiz status:', error);
      setMessage('Failed to update quiz status');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            size: 12,
            weight: '500'
          },
          color: '#64748b'
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: { family: "'Segoe UI', sans-serif", size: 14, weight: 'bold' },
        bodyFont: { family: "'Segoe UI', sans-serif", size: 13 },
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-quiz-management">
        <div className="page-header">
          <h1>Quiz Management</h1>
          <p>Create and manage individual quiz questions for different domains</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
            <button onClick={() => setMessage('')} className="close-btn">×</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            📝 Manage Quizzes
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="quizzes-section">
            {/* Create Quiz Form */}
            <div className="create-quiz-section">
              <div className="section-header">
                <h2>Create New Quiz Question</h2>
                <span className="section-subtitle">Add individual quiz questions for different domains</span>
              </div>
              <form onSubmit={handleQuizSubmit} className="quiz-form">
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="domain">Domain (Topic) *</label>
                  <select
                    id="domain"
                    name="domain"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    required
                  >
                    <option value="">Select domain</option>
                    {domains.map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {questionsList.map((q, qIndex) => (
                    <div key={qIndex} className="question-block-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-color)' }}>
                          Question {qIndex + 1}
                        </h3>
                        {questionsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestionBlock(qIndex)}
                            className="remove-question-btn"
                          >
                            🗑️ Remove
                          </button>
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label htmlFor={`question-${qIndex}`}>Question Text *</label>
                        <textarea
                          id={`question-${qIndex}`}
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                          placeholder="Enter the quiz question..."
                          rows="3"
                          required
                        />
                      </div>

                      <div className="options-section" style={{ background: '#ffffff', marginBottom: '1.2rem' }}>
                        <label>Options *</label>
                        <div className="options-grid">
                          {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="option-input">
                              <label htmlFor={`option-${qIndex}-${oIndex}`}>
                                {String.fromCharCode(65 + oIndex)}:
                              </label>
                              <input
                                type="text"
                                id={`option-${qIndex}-${oIndex}`}
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor={`correctAnswer-${qIndex}`}>Correct Answer *</label>
                          <select
                            id={`correctAnswer-${qIndex}`}
                            value={q.correctAnswer}
                            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                            required
                          >
                            <option value="">Select correct answer</option>
                            {q.options.map((option, oIndex) => (
                              <option key={oIndex} value={String.fromCharCode(65 + oIndex)} disabled={!option.trim()}>
                                {String.fromCharCode(65 + oIndex)}: {option || 'Enter option first'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor={`explanation-${qIndex}`}>Explanation (Optional)</label>
                          <textarea
                            id={`explanation-${qIndex}`}
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                            placeholder="Explain why this answer is correct..."
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-actions-row">
                  <button
                    type="button"
                    onClick={addQuestionBlock}
                    className="add-another-btn"
                  >
                    ➕ Add Another Question
                  </button>

                  <button type="submit" disabled={loading} className="create-btn">
                    {loading ? 'Creating...' : `✨ Create ${questionsList.length} Quiz Question${questionsList.length > 1 ? 's' : ''}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Quizzes List */}
            <div className="quizzes-list-section">
              <div className="section-header">
                <h2>All Quiz Questions ({quizzes.length})</h2>
                <span className="section-subtitle">Manage your created quiz questions</span>
              </div>

              {loading ? (
                <div className="loading">Loading quizzes...</div>
              ) : quizzes.length === 0 ? (
                <div className="no-quizzes">
                  <p>No quiz questions created yet. Create your first one above!</p>
                </div>
              ) : (
                <div className="quizzes-grid">
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} className="quiz-card">
                      <div className="quiz-header">
                        <span className={`domain-badge ${quiz.domain.toLowerCase()}`}>
                          {quiz.domain}
                        </span>
                        <div className="quiz-actions">
                          <button
                            onClick={() => handleStatusToggle(quiz._id, quiz.status)}
                            className={`status-btn ${quiz.status === 'Active' ? 'active' : 'inactive'}`}
                          >
                            {quiz.status}
                          </button>
                          <button
                            onClick={() => handleQuizDelete(quiz._id)}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="quiz-content">
                        <h3 className="question-text">{quiz.question}</h3>

                        <div className="options-list">
                          {quiz.options.map((option, index) => (
                            <div key={index} className={`option ${String.fromCharCode(65 + index) === quiz.correctAnswer ? 'correct' : ''}`}>
                              <span className="option-label">
                                {String.fromCharCode(65 + index)}:
                              </span>
                              <span className="option-text">{option}</span>
                              {String.fromCharCode(65 + index) === quiz.correctAnswer && (
                                <span className="correct-badge">✓</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {quiz.explanation && (
                          <div className="explanation">
                            <strong>Explanation:</strong> {quiz.explanation}
                          </div>
                        )}
                      </div>

                      <div className="quiz-footer">
                        <span className="created-date">
                          Created: {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-header">
              <h2>Quiz Analytics</h2>
              <p>Overview of quiz performance and distribution</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>Total Questions</h3>
                  <p className="stat-number">{analyticsData.quizStats.totalQuizzes}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏷️</div>
                <div className="stat-content">
                  <h3>Domains Covered</h3>
                  <p className="stat-number">{analyticsData.quizStats.totalDomains}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Avg per Domain</h3>
                  <p className="stat-number">{analyticsData.quizStats.averageQuestions}</p>
                </div>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Questions by Domain</h3>
                <div className="chart-container">
                  <Doughnut
                    data={analyticsData.domainDistribution}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuizManagementPage; 