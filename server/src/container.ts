import { Pool } from 'pg';
import { dbConf } from './db/config.js';
import { TicketService } from './services/ticket.service.js';
import { TicketRepository } from './repositories/ticket.repository.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './services/user.service.js';

export const pool = new Pool(dbConf);

// Pass ticket dependencies
export const ticketRepository = new TicketRepository(pool);
export const ticketService = new TicketService(ticketRepository);

// Pass user dependencies
export const userRepository = new UserRepository(pool);
export const userService = new UserService(userRepository);