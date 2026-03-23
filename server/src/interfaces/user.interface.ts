export interface UserInterface {
  findUserById(userid: number): Promise<any>;
}
