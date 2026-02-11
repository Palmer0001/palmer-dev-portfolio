const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function fetchTickets() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Tickets`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch tickets: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

export async function fetchTicketById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Tickets/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ticket: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching ticket ${id}:`, error);
    throw error;
  }
}

export async function createTicket(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create ticket');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function updateTicket(id, formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update ticket');
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error updating ticket ${id}:`, error);
    throw error;
  }
}

export async function deleteTicket(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Tickets/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete ticket');
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error deleting ticket ${id}:`, error);
    throw error;
  }
}