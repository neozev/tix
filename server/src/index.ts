import express, { Request, Response } from 'express';
import cors from 'cors';
import { createTicket } from './handlers/createTicket';
import { getTickets } from './handlers/getTickets';
import { deleteTicket } from './handlers/deleteTicket';
import { updateTicket } from './handlers/updateTicket';
import { restoreDeletedTicket } from './handlers/restoreDeletedTicket';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.post('/api/ticket', createTicket);

app.get('/api/tickets', getTickets);

app.delete('/api/ticket/delete', deleteTicket);

app.patch('/api/ticket/restoreticket', restoreDeletedTicket);

app.patch('/api/ticket/update', updateTicket);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
