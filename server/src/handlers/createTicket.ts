import { Request, Response } from 'express';
import { ticketService } from '../container';

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  const { title, description, targetDepartment } = req.body;
  if (!title || !description || !targetDepartment) {
    res.status(400).json({
      error: 'Missing title, description or targetDepartment'
    });
  }

  const userId = 1; // hardcoded userId value, fine for now - we'll do dynamic user later on (including RBAC)
  try {
    const ticket = await ticketService.create({
      title,
      description,
      targetDepartment,
      userId
    });

    // Returns ticket as response to client
    res.status(200).json({
      ticket
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
}
