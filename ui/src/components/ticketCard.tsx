import { Ticket } from '../libs/types';
import './ticketCard.scss';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {

  type statusKey = 'open' | 'in_progress' | 'closed'

  const statusLabelFix = (statuslabel: statusKey) => {
    const status: Record<statusKey, { color: string; label: string }> = {
      open: { color: '#5db253', label: 'Open' },
      in_progress: { color: '#52afaf', label: 'In Progress' },
      closed: { color: '#b2b2b2', label: 'Closed' }
    };
    return status[statuslabel] || null;
  };

  const status = statusLabelFix(ticket.status as statusKey)

  return (
    <div className="ticket-card" onClick={onClick}>
      <div className="ticket-info">
        <h3 className="ticket-title">{ticket.title}</h3>
        <div className="ticket-footer">
          <p className="ticket-department">{ticket.target_department} Department</p>
          <p className="ticket-status" style={{ color: status.color }}>{status.label}</p>
          {ticket.deleted_at && (
            <span className="deleted-marker">Deleted</span>
          )}
        </div>
      </div>
    </div>
  );
}