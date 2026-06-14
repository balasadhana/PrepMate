import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import '../styles/UserLayout.css';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="user-layout">
      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-toggle" onClick={toggleSidebar}>
        <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>PrepMate</h2>
          <p>Your Interview Prep Hub</p>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/user/dashboard" 
            className={`nav-item ${isActive('/user/dashboard') ? 'active' : ''}`}
            onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link 
            to="/user/quiz" 
            className={`nav-item ${isActive('/user/quiz') ? 'active' : ''}`}
            onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Take Quiz</span>
          </Link>

          <Link 
            to="/user/materials" 
            className={`nav-item ${isActive('/user/materials') ? 'active' : ''}`}
            onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Study Material</span>
          </Link>

          <Link 
            to="/user/resume" 
            className={`nav-item ${isActive('/user/resume') ? 'active' : ''}`}
            onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-text">Resume Builder</span>
          </Link>

          <Link 
            to="/user/experience" 
            className={`nav-item ${isActive('/user/experience') ? 'active' : ''}`}
            onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Share Experience</span>
          </Link>

          <Link 
            to="/user/tips" 
            className={`nav-item ${isActive('/user/tips') ? 'active' : ''}`}
            onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          >
            <span className="nav-icon">💡</span>
            <span className="nav-text">Tips</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">{localStorage.getItem('username') || 'User'}</span>
              <span className="user-email">{localStorage.getItem('email') || 'user@example.com'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default UserLayout; 