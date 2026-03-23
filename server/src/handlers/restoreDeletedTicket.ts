import { Request, Response } from "express";
import { ticketService } from "../container";

export const restoreDeletedTicket = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.query;

    try {
        const ticketExists = await ticketService.findTicketById(Number(id));
        if (!ticketExists) {
            res.status(404).json({
                error: `Ticket with id ${id} does not exist.`
            });
            return;
        } else if (ticketExists.deleted_at !== null) {
            const restoreDeletedTicket = await ticketService.restoreTicketById(Number(id));
            res.status(200).json({
                restoreDeletedTicket,
                message: `Ticket with id ${id} has been successfully restored.`
            });
        } else {
            res.status(400).json({
                error: `Ticket with id ${id} has already been restored.`
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