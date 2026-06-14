import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Clear any session storage
    sessionStorage.clear();
    
    // Redirect to landing page
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link 
            to="/admin-dashboard" 
            className={isActive('/admin-dashboard') ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            className={isActive('/admin/users') ? 'active' : ''}
          >
            Manage Users
          </Link>
          <Link 
            to="/admin/quizzes" 
            className={isActive('/admin/quizzes') ? 'active' : ''}
          >
            Mock Interview
          </Link>
          <Link 
            to="/admin/materials" 
            className={isActive('/admin/materials') ? 'active' : ''}
          >
            Upload Materials
          </Link>
          <Link 
            to="/admin/tips" 
            className={isActive('/admin/tips') ? 'active' : ''}
          >
            Interview Tips
          </Link>
          <Link 
            to="/admin/templates" 
            className={isActive('/admin/templates') ? 'active' : ''}
          >
            Resume Templates
          </Link>
          <Link 
            to="/admin/experiences" 
            className={isActive('/admin/experiences') ? 'active' : ''}
          >
            Experience Approval
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Panel</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 