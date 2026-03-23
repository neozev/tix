import { useState } from 'react';
import { Ticket } from '../libs/types';
import { TicketStatus } from '../libs/constants';
import { FormatDate } from '../libs/formatDate';
import './ticketDetailModal.scss';

interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: (id: number, data: any) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

export default function TicketDetailModal({ 
  ticket, 
  onClose, 
  onUpdate, 
  onDelete,
  onRestore
}: TicketDetailModalProps) {
  const [isEncoding, setIsEncoding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [formData, setFormData] = useState({
    title: ticket.title,
    description: ticket.description,
    targetDepartment: ticket.target_department,
    status: ticket.status,
    deleted_at: ticket.deleted_at
  });

  const setIsNotDeleted = !ticket.deleted_at;
  
  const handleRestore = async () => {
    if (!window.confirm('Are you sure you want to restore this ticket?')) {
      return;
    }
    try {
      setIsRestoring(true);
      await onRestore(ticket.id);
      alert('Ticket restored successfully!');
    } catch (error) {
      alert('Failed to restore ticket');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsEditing(true);
      await onUpdate(ticket.id, formData);
      alert('Ticket updated successfully!');
    } catch (error) {
      alert('Failed to update ticket');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }
    try {
      setIsDeleting(true);
      await onDelete(ticket.id);
      alert('Ticket deleted successfully!');
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to delete ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusLabelFix = (statuslabel: string) => {
    if (statuslabel.includes("in_progress")) {
      return 'In Progress'
    }
    else {
      return statuslabel.charAt(0).toUpperCase() + statuslabel.slice(1)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
            { (isEncoding && setIsNotDeleted) ? (
              <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onBlur={() => setIsEncoding(false)}
            />
            ) : (
              <h2 className="form-group" onClick={() => setIsEncoding(true)}>{formData.title}</h2>
            )}
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          
          <div className="form-group">
            <label>Description</label>
            { (isEncoding && setIsNotDeleted) ? (
              <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onBlur={() => setIsEncoding(false)}
            />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }} className='form-group' onClick={() => setIsEncoding(true)}>{formData.description}</p>
            )}
          </div>

          <div className="form-group">
            <label>Department</label>
            { (isEncoding && setIsNotDeleted) ? (
              <select
              onChange={(e) => setFormData({ ...formData, targetDepartment: e.target.value })}
              onBlur={() => setIsEncoding(false)}
              value={formData.targetDepartment}
            >
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            ) : (
              <p className='form-group' onClick={() => setIsEncoding(true)}>{formData.targetDepartment}</p>
            )}
          </div>

          <div className="form-group">
            <label>Status</label>
            { (isEncoding && setIsNotDeleted) ? (
              <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {Object.entries(TicketStatus).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
            ) : (
              <p className='form-group' onClick={() => setIsEncoding(true)}>{statusLabelFix(formData.status)}</p>
            )}
          </div>

          <div className="ticket-metadata">
            <p><strong>Created by User ID</strong> - {ticket.user_id}</p>
            <p><strong>Created at</strong> - {FormatDate(ticket.createdAt)}</p>
            <p><strong>Updated at</strong> - {FormatDate(ticket.updatedAt)}</p>
            {ticket.deleted_at && (
              <p className="deleted-info">
                <strong style={{ color: 'ff0000' }}>Deleted at</strong> - {FormatDate(ticket.deleted_at)}
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          { setIsNotDeleted ? (
            <><button
              className="btn-update"
              onClick={handleUpdate}
              disabled={isEditing || ticket.deleted_at !== null}
            >
              {isEditing ? 'Updating...' : 'Update Ticket'}
            </button>
            <button
              className="btn-delete"
              onClick={handleDelete}
              disabled={isDeleting || ticket.deleted_at !== null}
            >
                {isDeleting ? 'Deleting...' : 'Delete Ticket'}
              </button></>
          ) : (
            <button 
              className="btn-restore" 
              onClick={handleRestore}
              disabled={isRestoring || !ticket.deleted_at}
          >
            {isRestoring ? 'Restoring' : 'Restore Ticket'}
          </button>
          )}
        </div>
      </div>
    </div>
  );
}