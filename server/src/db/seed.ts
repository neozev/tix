import { pool } from '../container.js';

const seedData = async () => {
  try {
    console.log('Starting seed...');

    // Insert dummy users
    await pool.query(`
      INSERT INTO users (email, password, name, department, role) 
      VALUES 
        ('admin@tix.com', '$2b$10$dummyhashedpassword1', 'Admin User', 'IT', 'admin'),
        ('user1@tix.com', '$2b$10$dummyhashedpassword2', 'John Doe', 'IT', 'user'),
        ('user2@tix.com', '$2b$10$dummyhashedpassword3', 'Jane Smith', 'HR', 'user'),
        ('user3@tix.com', '$2b$10$dummyhashedpassword4', 'Bob Johnson', 'Finance', 'user')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('Users seeded successfully');

    // Optionally insert some dummy tickets
    await pool.query(`
      INSERT INTO tickets (title, description, target_department, user_id, status, deleted_at)
      VALUES
        ('Laptop not working', 'My laptop won''t turn on', 'IT', 2, 'open', NULL),
        ('Need new keyboard', 'Current keyboard is broken', 'IT', 3, 'in_progress', NULL),
        ('Payroll question', 'Question about my last paycheck', 'HR', 4, 'open', NULL)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Tickets seeded successfully');
    console.log('Seed completed!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
