import { Request, Response } from "express";
import { ticketService } from "../container";

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  const { userid, department, keyword, status, page, limit } = req.query;

  // Parse pagination params
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 20;

  try {
    const result = await ticketService.findTicketWithFilters(
      {
        userid: userid as number | undefined,
        department: department as string | undefined,
        keyword: keyword as string | undefined,
        status: status as string | undefined
      },
      pageNumber,
      limitNumber
    );

    res.status(200).json({
      tickets: result.tickets,
      pagination: {
        currentPage: pageNumber,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: limitNumber
      }
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: err.message || 'Internal server error'
    });
  }
}