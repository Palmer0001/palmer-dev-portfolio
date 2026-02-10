import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTicketAlt, 
  FaHome, 
  FaUser, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt, 
  FaBars,
  FaChevronDown,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard', exact: true },
    { path: '/tickets', icon: <FaTicketAlt />, label: 'Tickets' },
    ...(user?.role === 'admin' ? [
      { path: '/users', icon: <FaUsers />, label: 'Users' },
      { path: '/settings', icon: <FaCog />, label: 'Settings' },
    ] : []),
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo">
            <FaTicketAlt className="logo-icon" />
            <span>IT Support</span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/tickets/new" className="btn btn-primary btn-new-ticket">
            <FaPlus />
            <span>New Ticket</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <button 
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FaBars />
              </button>
              
              <div className="header-actions">
                <div className="user-dropdown">
                  <button 
                    className="user-menu-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <div className="user-avatar">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user?.firstName} {user?.lastName}</span>
                      <span className="user-role">{user?.role}</span>
                    </div>
                    <FaChevronDown className={`dropdown-icon ${userDropdownOpen ? 'open' : ''}`} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaUser />
                        <span>Profile</span>
                      </Link>
                      <button 
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;