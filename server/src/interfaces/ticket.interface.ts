import { Ticket } from "../libs/models";
import { FindTicketsInput } from "../libs/types";

export interface TicketInterface {
  create(input: any): Promise<any>;
  findTicketWithFilters(filters: FindTicketsInput, page: number, limit: number): Promise< {tickets: Ticket[]; total: number} >;
}