import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { 
  FaTicketAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaChartBar,
  FaUserTie
} from 'react-icons/fa';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentTickets from '../components/dashboard/RecentTickets';
import TicketChart from '../components/dashboard/TicketChart';

const Dashboard = () => {
  const { user, isAdmin, isAgent } = useAuth();
  const { 
    getTickets, 
    getTicketStats, 
    stats, 
    loading 
  } = useTickets();

  useEffect(() => {
    getTickets({ limit: 5 });
    getTicketStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statsCards = [
    {
      title: 'Total Tickets',
      value: stats?.summary?.total || 0,
      icon: <FaTicketAlt />,
      color: 'primary',
      change: '+12%',
    },
    {
      title: 'Open Tickets',
      value: stats?.summary?.open || 0,
      icon: <FaClock />,
      color: 'warning',
      change: '+5%',
    },
    {
      title: 'In Progress',
      value: stats?.summary?.inProgress || 0,
      icon: <FaUserTie />,
      color: 'info',
      change: '+8%',
    },
    {
      title: 'Resolved',
      value: stats?.summary?.resolved || 0,
      icon: <FaCheckCircle />,
      color: 'success',
      change: '+15%',
    },
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section mb-4">
        <h1 className="welcome-title">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="welcome-subtitle">
          Here's what's happening with your tickets today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-3">
            <div className={`stats-card stats-card-${stat.color}`}>
              <div className="stats-icon">{stat.icon}</div>
              <div className="stats-content">
                <h3 className="stats-value">{stat.value}</h3>
                <p className="stats-title">{stat.title}</p>
                <span className="stats-change positive">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Tickets */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaChartBar className="me-2" />
                Ticket Statistics
              </h5>
            </div>
            <div className="card-body">
              <TicketChart stats={stats} />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaExclamationTriangle className="me-2" />
                Priority Distribution
              </h5>
            </div>
            <div className="card-body">
              {stats?.priority?.map((item, index) => (
                <div key={index} className="priority-item mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="priority-label text-capitalize">{item._id}</span>
                    <span className="priority-count">{item.count}</span>
                  </div>
                  <div className="priority-bar">
                    <div 
                      className={`priority-progress priority-${item._id}`}
                      style={{
                        width: `${(item.count / stats.summary.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Tickets</h5>
              <Link to="/tickets" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>
            <div className="card-body">
              <RecentTickets />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Agents/Admins */}
      {(isAdmin || isAgent) && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-flex gap-3">
                  <Link to="/tickets/new" className="btn btn-primary">
                    Create New Ticket
                  </Link>
                  <Link to="/tickets?status=open" className="btn btn-outline">
                    View Open Tickets
                  </Link>
                  <Link to="/tickets?status=in-progress" className="btn btn-outline">
                    View Assigned Tickets
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;