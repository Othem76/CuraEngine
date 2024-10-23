import CreateUserPayload from "#models/user/createUserPayload";
import UpdateUserPayload from "#models/user/updateUserPayload";
import User from "#models/user/user";

export default interface UserRepositoryInterface {
  getAllUsers(): Promise<User[]>;

  getUserById(userId: number): Promise<User>;

  getUserByEmail(email: string): Promise<User | null>;

  createUser(user: CreateUserPayload): Promise<User>;

  updateUser(userId: number, payload: UpdateUserPayload): Promise<User>;

  deleteUser(userId: number): Promise<void>;
}
