import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaUserTie,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const TicketTable = ({ tickets, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaClock className="text-success" />;
      case 'in-progress': return <FaUserTie className="text-warning" />;
      case 'resolved': return <FaCheckCircle className="text-info" />;
      default: return <FaCheckCircle className="text-muted" />;
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>
                <span className="ticket-id">#{ticket._id.slice(-6)}</span>
              </td>
              <td>
                <Link to={`/tickets/${ticket._id}`} className="ticket-title">
                  {ticket.title}
                </Link>
                <div className="ticket-meta text-muted">
                  {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <span className={`status-indicator status-${ticket.status}`}>
                    <span className="status-dot"></span>
                    {ticket.status}
                  </span>
                </div>
              </td>
              <td>
                <span className={`badge badge-${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span className="text-capitalize">{ticket.category}</span>
              </td>
              <td>
                <div className="text-muted small">
                  {format(new Date(ticket.createdAt), 'PP')}
                </div>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Link 
                    to={`/tickets/${ticket._id}`}
                    className="btn btn-sm btn-outline"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <button 
                    className="btn btn-sm btn-outline"
                    title="Edit"
                    onClick={() => {/* Handle edit */}}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline btn-danger"
                    title="Delete"
                    onClick={() => onDelete?.(ticket._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;