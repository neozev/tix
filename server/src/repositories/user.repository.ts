import { Pool } from 'pg';
import { UserInterface } from '../interfaces/user.interface.js';
import { User } from '../libs/models.js';

export class UserRepository implements UserInterface {
  constructor(private db: Pool) { } 

  async findUserById(userId: number): Promise<User> {
    const result = await this.db.query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`, [userId]
    );
    return result.rows[0];
  }
}