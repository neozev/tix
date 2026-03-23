import { useState } from 'react';
import './index.scss';
import { createTicket } from '../../api/ticket';

export default function CreateTicket() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetDepartment: formData.get('targetDepartment') as string,
    };

    try {
      const res = await createTicket(data);
      console.log('Ticket created:', res);

      // Reset form
      form.reset();
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-ticket">

      <h2>Create Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="ticket-input-box">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select name="targetDepartment" required>
              <option value="">Select department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Ticket'}
          </button>
      </div>
      </form>
    </div>
  );
}
