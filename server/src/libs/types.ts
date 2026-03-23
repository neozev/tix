export type CreateTicketInput = {
  title: string;
  description: string;
  targetDepartment: string;
  userId: number;
};

export type FindTicketsInput = {
  userid?: number;
  department?: string;
  keyword?: string;
  status?: string;
}

export type UpdateTicketInput = {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  targetDepartment?: string;
}