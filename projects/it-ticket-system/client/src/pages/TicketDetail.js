import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import TicketHeader from '../components/tickets/TicketHeader';
import TicketComments from '../components/tickets/TicketComments';
import TicketActions from '../components/tickets/TicketActions';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaEdit,
  FaTrash,
  FaPaperclip
} from 'react-icons/fa';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticket, loading, getTicket, deleteTicket } = useTickets();
  const { user, isAdmin, isAgent } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    getTicket(id);
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      const result = await deleteTicket(id);
      if (result.success) {
        navigate('/tickets');
      }
    }
  };

  const canEdit = () => {
    if (!ticket) return false;
    if (isAdmin) return true;
    if (ticket.createdBy._id === user?.id) return true;
    if (isAgent && ticket.assignedTo?._id === user?.id) return true;
    return false;
  };

  const canDelete = () => {
    if (!ticket) return false;
    if (isAdmin) return true;
    return ticket.createdBy._id === user?.id;
  };

  if (loading && !ticket) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="spin" size={30} />
        <p className="mt-3">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-5">
        <h4>Ticket not found</h4>
        <p className="mt-2">The requested ticket does not exist or you don't have permission to view it.</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/tickets')}
        >
          <FaArrowLeft className="me-2" />
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-detail">
      {/* Back Button */}
      <div className="mb-4">
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/tickets')}
        >
          <FaArrowLeft className="me-2" />
          Back to Tickets
        </button>
      </div>

      {/* Ticket Header */}
      <TicketHeader ticket={ticket} />

      {/* Action Buttons */}
      <div className="d-flex gap-2 mb-4">
        {canEdit() && (
          <button 
            className="btn btn-outline"
            onClick={() => navigate(`/tickets/${id}/edit`)}
          >
            <FaEdit className="me-2" />
            Edit Ticket
          </button>
        )}
        
        {canDelete() && (
          <button 
            className="btn btn-outline btn-danger"
            onClick={handleDelete}
          >
            <FaTrash className="me-2" />
            Delete Ticket
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments
              {ticket.comments?.length > 0 && (
                <span className="badge ms-2">{ticket.comments.length}</span>
              )}
            </button>
            <button
              className={`tab-btn ${activeTab === 'attachments' ? 'active' : ''}`}
              onClick={() => setActiveTab('attachments')}
            >
              <FaPaperclip className="me-2" />
              Attachments
              {ticket.attachments?.length > 0 && (
                <span className="badge ms-2">{ticket.attachments.length}</span>
              )}
            </button>
            {(isAdmin || isAgent) && (
              <button
                className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                Activity Log
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Description</h5>
                </div>
                <div className="card-body">
                  <div className="ticket-description">
                    {ticket.description}
                  </div>
                </div>
              </div>

              {ticket.resolution && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Resolution</h5>
                  </div>
                  <div className="card-body">
                    <div className="resolution-details">
                      <p>{ticket.resolution.description}</p>
                      <div className="resolution-meta text-muted">
                        <small>
                          Resolved by {ticket.resolution.resolvedBy?.firstName}{' '}
                          {ticket.resolution.resolvedBy?.lastName} on{' '}
                          {format(new Date(ticket.resolution.resolvedAt), 'PPpp')}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Ticket Information</h5>
                </div>
                <div className="card-body">
                  <div className="info-item mb-3">
                    <label className="info-label">Ticket ID</label>
                    <div className="info-value">{ticket._id}</div>
                  </div>
                  
                  <div className="info-item mb-3">
                    <label className="info-label">Created By</label>
                    <div className="info-value">
                      {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                      <div className="text-muted small">{ticket.createdBy.email}</div>
                    </div>
                  </div>
                  
                  <div className="info-item mb-3">
                    <label className="info-label">Created Date</label>
                    <div className="info-value">
                      {format(new Date(ticket.createdAt), 'PPpp')}
                    </div>
                  </div>
                  
                  <div className="info-item mb-3">
                    <label className="info-label">Last Updated</label>
                    <div className="info-value">
                      {format(new Date(ticket.updatedAt), 'PPpp')}
                    </div>
                  </div>
                  
                  {ticket.dueDate && (
                    <div className="info-item mb-3">
                      <label className="info-label">Due Date</label>
                      <div className="info-value">
                        {format(new Date(ticket.dueDate), 'PPP')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Actions (for agents/admins) */}
              {(isAdmin || isAgent) && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <TicketActions ticket={ticket} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && <TicketComments ticketId={id} />}
        
        {activeTab === 'attachments' && (
          <div className="card">
            <div className="card-body">
              {ticket.attachments?.length > 0 ? (
                <div className="attachments-grid">
                  {ticket.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <div className="attachment-icon">
                        <FaPaperclip />
                      </div>
                      <div className="attachment-info">
                        <div className="attachment-name">{attachment.filename}</div>
                        <div className="attachment-meta text-muted">
                          Uploaded {format(new Date(attachment.uploadedAt), 'PP')}
                        </div>
                      </div>
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaPaperclip size={48} className="text-muted mb-3" />
                  <h5>No attachments</h5>
                  <p className="text-muted">No files have been attached to this ticket.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;