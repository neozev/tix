import { TicketStatus } from './constants.ts';

export type CreateTicketData = {
  title: string;
  description: string;
  targetDepartment: string;
};

export type UpdateTicketData = {
  id: number;
  title?: string;
  description?: string;
  targetDepartment?: string;
  status?: string;
};

export type Ticket = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TicketStatus;
  target_department: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
};

// This is the 'shape' of the object that we will send to FE
// Be careful of what we want to expose in FE
export type User = {
  id: number;
  department: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;

  // We won't include password here, coz that is sensitive data
  // optionally, we could add updatedAt here, if necessary
}