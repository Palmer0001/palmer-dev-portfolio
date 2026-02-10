import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaShieldAlt } from 'react-icons/fa';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/" className="logo">
              <FaTicketAlt className="logo-icon" />
              <span>IT Ticket System</span>
            </Link>
            <nav>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary ml-2">
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="layout-main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="layout-footer">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="footer-brand">
              <FaShieldAlt />
              <span>IT Ticket System v{process.env.REACT_APP_VERSION}</span>
            </div>
            <div className="footer-links">
              <span>© {new Date().getFullYear()} All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;