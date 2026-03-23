import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import Layout from './layout';
import { NotFound } from './pages/error_handle/notFound'
import CreateTicket from './pages/ticket/createTicket'
import ViewTickets from "./pages/ticket/viewTicket"

export const pages = {
  CREATE_TICKET: { path: '/create-ticket', label: 'Create Ticket', element: CreateTicket},
  VIEW_TICKETS: { path: '/view-tickets', label: 'View Tickets', element: ViewTickets},
  }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        {Object.values(pages).map((page) => (
          <Route path={page.path} element={<page.element />} />
        ))}
        </Route>
        <Route path='/' element={<Navigate to="/create-ticket" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}