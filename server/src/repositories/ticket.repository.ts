import { Pool } from 'pg';
import { TicketInterface } from '../interfaces/ticket.interface.js';
import { CreateTicketInput, FindTicketsInput, UpdateTicketInput } from '../libs/types.js';
import { Ticket } from '../libs/models.js';

export class TicketRepository implements TicketInterface {
  constructor(private db: Pool) { }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const { title, description, targetDepartment, userId } = input;
    const result = await this.db.query(
      `INSERT INTO tickets (title, description, target_department, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, targetDepartment, userId]
    );
    return result.rows[0];
  }

  async findTicketWithFilters(
    filters: FindTicketsInput,
    page: number = 1,
    limit: number = 20
  ): Promise<{ tickets: Ticket[]; total: number }> {
    
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (filters.userid) {
      conditions.push(`user_id = $${values.length + 1}`);
      values.push(filters.userid);
    }

    if (filters.department) {
      conditions.push(`target_department = $${values.length + 1}`);
      values.push(filters.department);
    }

    if (filters.keyword) {
      conditions.push(
        `(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`
      );
      values.push(`%${filters.keyword}%`);
    }

    if (filters.status?.includes("deleted")){
      conditions.push('deleted_at IS not NULL');
    } else if (filters.status) {
      conditions.push(`deleted_at IS NULL`);
      conditions.push(`status = $${values.length + 1}`);
      values.push(filters.status as string);
    } else if (!filters.status) {
      conditions.push(`deleted_at IS NULL`);
    };

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Find number of total tickets
    const countResult = await this.db.query(
      `SELECT COUNT(*) as total FROM tickets ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total);

    // Offset pagination
    const offset = (page - 1) * limit;
    
    // Add LIMIT and OFFSET to the values array
    const paginationValues = [...values, limit, offset];
    
    const result = await this.db.query(
      `SELECT * FROM tickets 
       ${whereClause}
       ORDER BY "createdAt" DESC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      paginationValues
    );

    return {
      tickets: result.rows,
      total: total
    };
  }

  async UpdateTicketById(input: UpdateTicketInput): Promise<Ticket> {
    const { id, title, description, targetDepartment, status } = input;
    const fields: string[] = [];
    const values: (string | number)[] = [];

    values.push(id);
    fields.push(`id = $${values.length}`);

    if (title) {
      values.push(title);
      fields.push(`title = $${values.length}`);
    }

    if (description) {
      values.push(description);
      fields.push(`description = $${values.length}`);
    }

    if (targetDepartment) {
      values.push(targetDepartment);
      fields.push(`target_department = $${values.length}`);
    }

    if (status) {
      values.push(status);
      fields.push(`status = $${values.length}`);
    }

    fields.push(`"updatedAt" = NOW()`);

    const query = `UPDATE tickets SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async findTicketById(id: number): Promise<Ticket> {
  const result = await this.db.query(
    `SELECT * FROM tickets WHERE id = $1`, [id]
    );
    return result.rows[0];
  }

  async deleteTicketById(id: number): Promise<Ticket> {
    const result = await this.db.query(
      `UPDATE tickets SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`, [id]
    );
    return result.rows[0];
  }

  async restoreDeletedTicketById(id: number): Promise<Ticket> {
    const result = await this.db.query(
      `UPDATE tickets SET deleted_at = NULL WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0];
  }
}