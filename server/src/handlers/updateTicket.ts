import { Request, Response } from "express";
import { ticketService } from "../container";

export const updateTicket = async (req: Request, res: Response): Promise<void> => {

    const { id, title, description, targetDepartment, status } = req.body;

    if (!id) {
        res.status(400).json({
            error: 'Missing ticket id'
        });
        return;
        }
    
    try {
        const ticketExists = await ticketService.findTicketById(Number(id));
        if (!ticketExists) {
            res.status(404).json({
                error: `Ticket with id ${id} does not exist.`
            });
            return;
        } else if (ticketExists.deleted_at == null) {
            const updateTicket = await ticketService.updateTicketById({
                id: Number(id),
                title: title as string | undefined,
                description: description as string | undefined,
                targetDepartment: targetDepartment as string | undefined,
                status: status as string | undefined
            });
            res.status(200).json({
                updateTicket,
                message: `Ticket with id ${id} has been successfully updated.`
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