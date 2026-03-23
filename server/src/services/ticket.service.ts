import { TicketInterface } from '../interfaces/ticket.interface.js';
import { Ticket } from '../libs/models.js';
import { CreateTicketInput, UpdateTicketInput, FindTicketsInput } from '../libs/types.js';
import { TicketRepository } from '../repositories/ticket.repository.js';

export class TicketService implements TicketInterface {
  constructor(private repo: TicketRepository) { }

  async create(input: CreateTicketInput): Promise<Ticket> {
    return await this.repo.create(input);
  }
  
  async findTicketWithFilters(
    filters: FindTicketsInput,
    page: number = 1,
    limit: number = 20
  ): Promise<{ tickets: Ticket[]; total: number; totalPages: number }> {
    
    if (page < 1) page = 1; // Validate pagination params
    if (limit < 1 || limit > 100) limit = 20; // Max 100 per page

    const result = await this.repo.findTicketWithFilters(filters, page, limit);

    return {
      tickets: result.tickets,
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  async updateTicketById(input: UpdateTicketInput): Promise<Ticket> {
    return this.repo.UpdateTicketById(input);
  }

  async findTicketById(id: number): Promise<Ticket> {
    return await this.repo.findTicketById(id);
  }

  async deleteTicketById(id: number): Promise<Ticket> {
    return await this.repo.deleteTicketById(id);
  }

  async restoreTicketById(id: number): Promise<Ticket> {
    return await this.repo.restoreDeletedTicketById(id);
  }
}
