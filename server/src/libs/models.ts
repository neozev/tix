import { TicketStatus } from "./enums";

export type Ticket = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TicketStatus;
  target_department: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  department: string;
  role: string;
  created_at: string;
  updated_at: string;
}