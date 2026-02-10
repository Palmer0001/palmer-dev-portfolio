import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import TicketTable from '../components/tickets/TicketTable';
import TicketFilters from '../components/tickets/TicketFilters';
import { FaPlus, FaFilter, FaSync } from 'react-icons/fa';

const Tickets = () => {
  const { tickets, loading, filters, getTickets, updateFilters } = useTickets();
  const { user } = useAuth();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    getTickets();
  }, []);

  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }));
  };

  const applyFilters = () => {
    updateFilters(localFilters);
    getTickets(localFilters);
  };

  const resetFilters = () => {
    const reset = {
      status: '',
      priority: '',
      category: '',
      page: 1,
      sort: '-createdAt'
    };
    setLocalFilters(reset);
    updateFilters(reset);
    getTickets(reset);
  };

  const handlePageChange = (page) => {
    handleFilterChange({ page });
    applyFilters();
  };

  return (
    <div className="tickets-page">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">Tickets</h1>
            <p className="page-subtitle">Manage and track all support tickets</p>
          </div>
          <div>
            <Link to="/tickets/new" className="btn btn-primary">
              <FaPlus className="me-2" />
              New Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <FaFilter className="me-2" />
              Filters
            </h6>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline btn-sm"
                onClick={resetFilters}
                disabled={loading}
              >
                Reset
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={applyFilters}
                disabled={loading}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          <TicketFilters 
            filters={localFilters}
            onChange={handleFilterChange}
            user={user}
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            All Tickets
            {loading && <FaSync className="spin ms-2" />}
          </h5>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => getTickets()}
              disabled={loading}
            >
              <FaSync className={loading ? 'spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
        <div className="card-body">
          {loading && !tickets.length ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state">
                <FaTicketAlt className="empty-icon" />
                <h4>No tickets found</h4>
                <p>Try adjusting your filters or create a new ticket</p>
                <Link to="/tickets/new" className="btn btn-primary mt-3">
                  Create New Ticket
                </Link>
              </div>
            </div>
          ) : (
            <>
              <TicketTable tickets={tickets} />
              
              {/* Pagination */}
              {filters.total > filters.limit && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={filters.page === 1}
                        >
                          Previous
                        </button>
                      </li>
                      
                      {Array.from(
                        { length: Math.ceil(filters.total / filters.limit) },
                        (_, i) => i + 1
                      ).slice(
                        Math.max(0, filters.page - 3),
                        Math.min(Math.ceil(filters.total / filters.limit), filters.page + 2)
                      ).map(page => (
                        <li 
                          key={page} 
                          className={`page-item ${filters.page === page ? 'active' : ''}`}
                        >
                          <button 
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${filters.page === Math.ceil(filters.total / filters.limit) ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={filters.page === Math.ceil(filters.total / filters.limit)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;