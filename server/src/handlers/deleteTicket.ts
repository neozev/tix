import { Request, Response } from "express";
import { ticketService } from "../container";

export const deleteTicket = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.query;

    try {
        const ticketExists = await ticketService.findTicketById(Number(id));
        if (!ticketExists) {
            res.status(404).json({
                error: `Ticket with id ${id} does not exist.`
            });
            return;
        } else if (ticketExists.deleted_at == null) {
            const deleteTicket = await ticketService.deleteTicketById(Number(id));
            res.status(204).json({
                message: `Ticket with id ${id} has been successfully deleted.`
            });
            return;
        } else {
            res.status(400).json({
                error: `Ticket with id ${id} has already been deleted.`
            });
            console.log(ticketExists);
            return;
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            error: err.message || 'Internal server error'
        });
    }
}