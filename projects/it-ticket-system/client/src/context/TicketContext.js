import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    page: 1,
    limit: 10,
    sort: '-createdAt'
  });

  // Get all tickets
  const getTickets = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, ...params };
      const response = await axios.get('/tickets', { params: queryParams });
      
      setTickets(response.data.data);
      setFilters(queryParams);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tickets';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Get single ticket
  const getTicket = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/tickets/${id}`);
      setTicket(response.data.ticket);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch ticket';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Create ticket
  const createTicket = async (ticketData) => {
    setLoading(true);
    try {
      const response = await axios.post('/tickets', ticketData);
      toast.success('Ticket created successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create ticket';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update ticket
  const updateTicket = async (id, ticketData) => {
    setLoading(true);
    try {
      const response = await axios.put(`/tickets/${id}`, ticketData);
      toast.success('Ticket updated successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update ticket';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket
  const deleteTicket = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/tickets/${id}`);
      setTickets(tickets.filter(ticket => ticket._id !== id));
      toast.success('Ticket deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete ticket';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Add comment to ticket
  const addComment = async (id, commentData) => {
    setLoading(true);
    try {
      const response = await axios.post(`/tickets/${id}/comments`, commentData);
      toast.success('Comment added successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Assign ticket to agent
  const assignTicket = async (id, agentId) => {
    setLoading(true);
    try {
      const response = await axios.put(`/tickets/${id}/assign`, { agentId });
      toast.success('Ticket assigned successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign ticket';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Resolve ticket
  const resolveTicket = async (id, resolutionDescription) => {
    setLoading(true);
    try {
      const response = await axios.put(`/tickets/${id}/resolve`, { resolutionDescription });
      toast.success('Ticket resolved successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resolve ticket';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get ticket statistics
  const getTicketStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/tickets/stats');
      setStats(response.data.stats);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch statistics';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    tickets,
    ticket,
    loading,
    stats,
    filters,
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    assignTicket,
    resolveTicket,
    getTicketStats,
    updateFilters,
    refreshTickets: () => getTickets(filters)
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};