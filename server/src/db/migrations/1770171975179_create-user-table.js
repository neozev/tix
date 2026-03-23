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
  // Create type contraints for role
  pgm.createType('user_role', ['admin', 'user']);

  // Define user table
  pgm.createTable('users', {
    id: 'id',
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    password: {
      type: 'varchar(255)',
      notNull: true
    },
    name: {
      type: 'varchar(255)'
    },
    department: {
      type: 'varchar(255)'
    },
    role: {
      type: 'user_role',
      notNull: true,
      default: 'user'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Creates index for faster look ups
  pgm.createIndex('users', 'department');
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'role');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropType('user_role');
};
