import { UserInterface } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';
import { User } from '../libs/models.js';

export class UserService implements UserInterface {
  constructor(private repo: UserRepository) { }

  async findUserById(userid: number): Promise<User> {
    return await this.repo.findUserById(userid);
  }
}