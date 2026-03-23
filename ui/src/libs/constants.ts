export const TicketStatus = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Closed'
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketSort = {
  noSort:         { label: 'No Sort', item: '', dir: ''},
  ascTitle:       { label: '↑ Title',       item: 'title',      dir: 'asc'  },
  descTitle:      { label: '↓ Title',       item: 'title',      dir: 'desc' },
  ascCreated:     { label: '↑ Created',     item: 'createdAt', dir: 'asc'  },
  descCreated:    { label: '↓ Created',     item: 'createdAt', dir: 'desc' },
  ascUpdated:     { label: '↑ Updated',     item: 'updatedAt', dir: 'asc'  },
  descUpdated:    { label: '↓ Updated',     item: 'updatedAt', dir: 'desc' },
} as const;

export type TicketSort = typeof TicketSort[keyof typeof TicketSort];