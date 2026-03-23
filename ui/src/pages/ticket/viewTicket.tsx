import { useState, useEffect } from 'react';
import { getTickets, updateTicket, deleteTicket, restoreTicket } from '../../api/ticket';
import { Ticket } from '../../libs/types';
import { TicketSort, TicketStatus } from '../../libs/constants';
import TicketCard from '../../components/ticketCard';
import TicketDetailModal from '../../components/ticketDetailModal';
import './index.scss';

export default function ViewTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sortMethod, setSortMethod] = useState<TicketSort | null | undefined>({
    label: 'No Sort', 
    item: '', 
    dir: ''});
  const [filters, setFilters] = useState({
    department: '',
    keyword: '',
    status: '',
  });

  // Paginaton values
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const items_per_page = 12;

  // Ticket fetch handle
  const fetchTickets = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getTickets({
        department: filters.department || undefined,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
        page: page,
        limit: items_per_page
      });
        setTickets(data.tickets);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } catch (err: any) {
        setError(err.message || 'Failed to load tickets');
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
  };

  // Ticket update handle
  const handleUpdateTicket = async (id: number, data: any) => {
    try {
      const updatedTicket = await updateTicket({
        id,
        title: data.title,
        description: data.description,
        targetDepartment: data.targetDepartment,
        status: data.status,
      })
      setSelectedTicket(updatedTicket);
      fetchTickets(currentPage);
    } catch (err: any) {
      setError(err.message || 'Failed to update tickets');
    }
  };

  // Ticket deletion handle
  const handleDeleteTicket = async (id: number) => {
    try {
      await deleteTicket(id);
      fetchTickets(currentPage);
    } catch (err: any) {
      setError(err.message || 'Failed to delete ticket');
    }
  }

  // Ticket restore handle
  const handleRestoreTicket = async (id: number) => {
    try {
      const restoreDeletedTicket = await restoreTicket(id);
      setSelectedTicket(restoreDeletedTicket);
      fetchTickets(currentPage);
    } catch (err: any) {
      setError(err.message || 'Failed to restore ticket');
    }
  }

  // Fetch tickets upon starting page
  useEffect(() => {
    fetchTickets(1);
  }, []);

  // Search with filters and reset to page 1
  const handleSearch = () => {
    fetchTickets(1);
  }

  // Reset filters and reset to page 1
  const handleClearFilters = () => {
    setFilters({
      department: '',
      keyword: '',
      status: '',
    });
  }

  const handleSort = (item: TicketSort) => {
    setTickets((prev) => [...prev].sort((a, b) => {
      const valA = a[item.item as keyof Ticket];
      const valB = b[item.item as keyof Ticket];

      if (valA! < valB!) return item.dir === 'asc' ? -1 : 1;
      if (valA! > valB!) return item.dir === 'asc' ? 1 : -1;
      return 0;
    }))
  }

  // Check for invalid page number then jump to page
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchTickets(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
        // Near the beginning: 1 2 3 4 ... 10
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
        // Near the end: 1 ... 7 8 9 10
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        // In the middle: 1 ... 4 5 6 ... 10 
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage)
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    } 

    return pages;
  };

  return (
    <div className="view-tickets">
      <h2>View Tickets</h2>

      {/* Filter section */}
      <div className="filters-box">

        {/* Keyword */}
        <div className="filter-search">
          <label>Search</label>
          <input
            type='text'
            placeholder='Search in title or description...'
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Department */}
        <div className="filter-group">
          <label>Department</label>
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value})}
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status:e.target.value})}
          >
            <option value=''>Any Status</option>
            {Object.entries(TicketStatus).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
            <option key='deleted' value='deleted'>Deleted</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={`${sortMethod!.item}|${sortMethod!.dir}`}
            onChange={(e) => {
              setSortMethod(Object.values(TicketSort).find(
                (sort) => sort.item + '|' + sort.dir === e.target.value
              ));
              if (sortMethod) {
                handleSort(sortMethod);
              }
            }}
            >
            {Object.values(TicketSort).map((sort) => (
            <option key={sort.label} value={`${sort.item}|${sort.dir}`}>
              {sort.label}
            </option>
          ))}
          </select>
        </div>
        
        {/* Buttons */}
        <div className='button-box'>
          <div className='button-group'>
            <button className='btn-search' onClick={handleSearch}>
              Apply Filters
            </button>
            <button className='btn-clear' onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {!isLoading && !error && (
        <div className="results-summary">
          <p>
            Showing{' '}
            {tickets.length > 0 ? (currentPage - 1) * items_per_page + 1 : 0}
            {' - '}
            {Math.min(currentPage * items_per_page, totalItems)} of {totalItems} tickets
          </p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && <p className="loading">Loading tickets...</p>}

      {/* Error State */}
      {error && <p className="error">{error}</p>}

      {/* Empty State */}
      {!isLoading && !error && tickets.length === 0 && (
        <p className="empty-state">
          {filters.keyword || filters.department || filters.status
            ? 'No tickets match your filters.'
            : 'No tickets found.'}
        </p>
      )}

      {/* Ticket Grid */}
      {!isLoading && !error && tickets.length > 0 && (
        <>
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </button>

              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page as number)}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                )
              )}

               <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Ticket Detail Modal */}
        {selectedTicket && (
          <TicketDetailModal
          key={`${selectedTicket.id}-${selectedTicket.deleted_at || 'active'}`}
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={handleUpdateTicket}
            onDelete={handleDeleteTicket}
            onRestore={handleRestoreTicket}
        />
      )}
    </div>
  );
}