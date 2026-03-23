/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Create type for ticket status
  pgm.createType("ticket_status", ["open", "in_progress", "closed"]);

  // Define table
  pgm.createTable("tickets", {
    id: "id",
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "varchar(255)",
      notNull: true,
    },
    target_department: {
      type: "varchar(100)",
      notNull: true,
    },
    status: {
      type: "ticket_status",
      notNull: true,
      default: "open",
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deleted_at: {
      type: "timestamp",
      notNull: false,
      default: null,
    },
  });

  // Create index for faster lookups
  pgm.createIndex("tickets", "user_id");
  pgm.createIndex("tickets", "target_department");
  pgm.createIndex("tickets", "status");
  pgm.createIndex("tickets", "deleted_at");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("tickets");
  pgm.dropType("ticket_status");
};
