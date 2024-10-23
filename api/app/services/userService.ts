import User from "#models/user/user";
import userRepository from "#repositories/userRepository";
import CreateUserPayload from "#models/user/createUserPayload";
import { inject } from "@adonisjs/core";
import UpdateUserPayload from "#models/user/updateUserPayload";

@inject()
export default class UserService {
  constructor(private readonly repository: userRepository) {}

  async getAllUsers(): Promise<User[]> {
    return await this.repository.getAllUsers();
  }

  async getUserById(userId: number): Promise<User> {
    return await this.repository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.repository.getUserByEmail(email);
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    const user = await this.repository.createUser(payload);
    return user;
  }

  async updateUser(userId: number, payload: UpdateUserPayload): Promise<User> {
    return await this.repository.updateUser(userId, payload);
  }

  async deleteUser(userId: number): Promise<void> {
    return await this.repository.deleteUser(userId);
  }
}
