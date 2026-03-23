import type { CreateTicketData, Ticket, UpdateTicketData } from "../../libs/types";

// Create ticket
export const createTicket = async (data: CreateTicketData): Promise<Ticket> => {
  const CREATE_TICKET_URL = import.meta.env.VITE_CREATE_TICKET_URL || '';

  try {
    const response = await fetch(CREATE_TICKET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    const result = await response.json();
    return result.ticket;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to create ticket');
  }
}

// Fetch tickets
export const getTickets = async (filters?: {
    userid?: number;
    department?: string;
    keyword?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    tickets: Ticket[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
  const GET_TICKETS_URL = import.meta.env.VITE_GET_TICKETS_URL || '';
  
  // Build query string
  const params = new URLSearchParams();
  if (filters?.userid) params.append('userid', String(filters.userid));
  if (filters?.department) params.append('department', filters.department);
  if (filters?.keyword) params.append('keyword', filters.keyword);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const url = `${GET_TICKETS_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const result = await response.json();
    return {
      tickets: result.tickets,
      pagination: result.pagination
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch tickets');
  }
}

// Update ticket
export const updateTicket = async (data: UpdateTicketData): Promise<Ticket> => {
  const UPDATE_TICKET_URL = import.meta.env.VITE_UPDATE_TICKET_URL || '';

  try {
    const response = await fetch(UPDATE_TICKET_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update ticket');
    }

    const result = await response.json();
    return result.updateTicket;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Delete ticket
export const deleteTicket = async (id: number): Promise<void> => {
  const DELETE_TICKET_URL = import.meta.env.VITE_DELETE_TICKET_URL || '';

  try {
    const response = await fetch(`${DELETE_TICKET_URL}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete ticket');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Restore ticket
export const restoreTicket = async (id: number): Promise<Ticket> => {
  const RESTORE_TICKET_URL = import.meta.env.VITE_RESTORE_TICKET_URL || '';

  try {
    const response = await fetch(`${RESTORE_TICKET_URL}?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to restore ticket');
    }

    const result = await response.json();
    return result.restoreDeletedTicket;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}