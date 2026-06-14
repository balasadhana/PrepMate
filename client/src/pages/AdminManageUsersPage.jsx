import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminManageUsersPage.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('user');
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: {
      labels: [],
      datasets: []
    },
    roleDistribution: {
      labels: [],
      datasets: []
    },
    statusDistribution: {
      labels: [],
      datasets: []
    },
    monthlyRegistrations: {
      labels: [],
      datasets: []
    }
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api/admin';

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term or role filter changes
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  // Generate analytics when users data changes
  useEffect(() => {
    if (users.length > 0) {
      generateAnalytics();
    }
  }, [users]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (roleFilter) params.append('role', roleFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`${API_BASE_URL}/users?${params}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Generate analytics data
  const generateAnalytics = () => {
    const regularUsers = users.filter(user => user.role === 'user');
    const adminUsers = users.filter(user => user.role === 'admin');
    const activeUsers = regularUsers.filter(user => user.isApproved);
    const pendingUsers = regularUsers.filter(user => !user.isApproved);

    // Role distribution
    const roleData = {
      labels: ['Regular Users', 'Admin Users'],
      datasets: [{
        data: [regularUsers.length, adminUsers.length],
        backgroundColor: ['#4e9eff', '#667eea'],
        borderWidth: 0
      }]
    };

    // Status distribution
    const statusData = {
      labels: ['Active Users', 'Pending Approval'],
      datasets: [{
        data: [activeUsers.length, pendingUsers.length],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    };

    // Monthly registrations (mock data for demonstration)
    const monthlyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Registrations',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: 'rgba(78, 158, 255, 0.8)',
        borderColor: '#4e9eff',
        borderWidth: 2
      }]
    };

    setAnalyticsData({
      userGrowth: monthlyData,
      roleDistribution: roleData,
      statusDistribution: statusData,
      monthlyRegistrations: monthlyData
    });
  };

  // Filter users based on search term and role
  const filterUsers = () => {
    // First, filter out admin users - only show regular users
    let filtered = users.filter(user => user.role !== 'admin');

    // Filter by role (but only for regular users)
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      
      setMessage(`User "${userName}" deleted successfully!`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Handle user view
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Clear search and filters
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('user');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'admin';
      case 'user': return 'user';
      default: return '';
    }
  };

  // ADD THIS FUNCTION HERE
const handleApproveUser = async (userId, userName) => {
  if (!window.confirm(`Approve user "${userName}"?`)) return;
  try {
    setLoading(true);
    await axios.patch(`${API_BASE_URL}/users/${userId}/approve`);
    setMessage(`User "${userName}" approved successfully!`);
    fetchUsers();
  } catch (error) {
    setMessage(error.response?.data?.error || 'Failed to approve user');
  } finally {
    setLoading(false);
  }
};

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-manage-users-page">
        <div className="page-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p className="subtitle">Manage and monitor user accounts across the platform</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchUsers} className="refresh-btn" disabled={loading}>
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Analytics Section */}
        <section className="analytics-section">
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-header">
                <h3>User Growth</h3>
                <span className="analytics-subtitle">Monthly registrations</span>
              </div>
              <div className="chart-container">
                {analyticsData.userGrowth.datasets.length > 0 ? (
                  <Bar data={analyticsData.userGrowth} options={barOptions} />
                ) : (
                  <div className="chart-placeholder">
                    <p>No user data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Role Distribution</h3>
                <span className="analytics-subtitle">Users by role</span>
              </div>
              <div className="chart-container">
                {analyticsData.roleDistribution.datasets.length > 0 ? (
                  <Doughnut data={analyticsData.roleDistribution} options={chartOptions} />
                ) : (
                  <div className="chart-placeholder">
                    <p>No role data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Status Distribution</h3>
                <span className="analytics-subtitle">Active vs pending users</span>
              </div>
              <div className="chart-container">
                {analyticsData.statusDistribution.datasets.length > 0 ? (
                  <Doughnut data={analyticsData.statusDistribution} options={chartOptions} />
                ) : (
                  <div className="chart-placeholder">
                    <p>No status data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="search-filter-section">
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-controls">
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="role-filter"
              >
                <option value="user">All Regular Users</option>
                <option value="user">Users Only</option>
              </select>
              
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Users Table */}
        <section className="users-section">
          <div className="table-header">
            <h2>Regular Users ({filteredUsers.length})</h2>
            <div className="table-actions">
              <span className="table-info">
                Showing {filteredUsers.length} of {users.filter(u => u.role === 'user').length} users
              </span>
            </div>
          </div>
          
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          )}
          
          {!loading && filteredUsers.length === 0 && (
            <div className="no-users">
              <div className="no-users-icon">👥</div>
              <h3>No Users Found</h3>
              <p>{searchTerm ? 'No regular users found matching your criteria.' : 'No regular users found.'}</p>
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className="user-row">
                      <td className="sno">{index + 1}</td>
                      <td className="name">
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{user.name || 'N/A'}</span>
                            <span className="user-id">ID: {user._id.slice(-8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="email">{user.email || 'N/A'}</td>
                      <td className="role">
                        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="joined-date">{formatDate(user.createdAt)}</td>
                      <td className="status">
                        <span className={`status-badge ${user.isApproved ? 'approved' : 'pending'}`}>
                          {user.isApproved ? '✅ Active' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="actions">
                        <div className="action-buttons">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="view-btn"
                            title="View user details"
                          >
                            👁️ View
                          </button>
                              {!user.isApproved && (
                               <button
                               onClick={() => handleApproveUser(user._id, user.name || user.email)}
                                 className="approve-btn"
                               title="Approve user"
                                 disabled={loading}
                                 >
                                 ✅ Approve
                                </button>
                              )}
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name || user.email)}
                            className="delete-btn"
                            title="Delete user"
                            disabled={loading}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Summary Statistics */}
        <section className="summary-section">
          <div className="summary-cards">
            <div className="summary-card primary">
              <div className="summary-icon">👥</div>
              <div className="summary-content">
                <h3>Total Regular Users</h3>
                <p className="summary-number">{users.filter(user => user.role === 'user').length}</p>
                <span className="summary-change positive">+12% this month</span>
              </div>
            </div>
            <div className="summary-card success">
              <div className="summary-icon">✅</div>
              <div className="summary-content">
                <h3>Active Users</h3>
                <p className="summary-number">{users.filter(user => user.role === 'user' && user.isApproved).length}</p>
                <span className="summary-change positive">+8% this week</span>
              </div>
            </div>
            <div className="summary-card warning">
              <div className="summary-icon">⏳</div>
              <div className="summary-content">
                <h3>Pending Approval</h3>
                <p className="summary-number">{users.filter(user => user.role === 'user' && !user.isApproved).length}</p>
                <span className="summary-change neutral">No change</span>
              </div>
            </div>
            <div className="summary-card info">
              <div className="summary-icon">👨‍💼</div>
              <div className="summary-content">
                <h3>Total Admins</h3>
                <p className="summary-number">{users.filter(user => user.role === 'admin').length}</p>
                <span className="summary-change neutral">Stable</span>
              </div>
            </div>
          </div>
        </section>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>User Details</h3>
                <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="user-detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedUser.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedUser.isApproved ? 'approved' : 'pending'}`}>
                      {selectedUser.isApproved ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Joined:</label>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span className="user-id">{selectedUser._id}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="delete-btn"
                  onClick={() => {
                    handleDeleteUser(selectedUser._id, selectedUser.name || selectedUser.email);
                    setShowUserModal(false);
                  }}
                >
                  Delete User
                </button>
                <button className="cancel-btn" onClick={() => setShowUserModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminManageUsersPage; 