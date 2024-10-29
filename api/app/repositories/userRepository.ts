import CreateUserPayload from "#models/user/createUserPayload";
import UpdateUserPayload from "#models/user/updateUserPayload";
import User from "#models/user/user";
import UserRepositoryInterface from "#repositoriesInterface/userRepositoryInterface";

export default class UserRepository implements UserRepositoryInterface {
  async getAllUsers(): Promise<User[]> {
    return await User.all();
  }
  async getUserById(userId: number): Promise<User> {
    return await User.findOrFail(userId);
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return await User.findBy("email", email);
  }
  async createUser(payload: CreateUserPayload): Promise<User> {
    const user = await User.create(payload);
    return user;
  }
  async updateUser(userId: number, payload: UpdateUserPayload): Promise<User> {
    const userModified = await User.updateOrCreate({ id: userId }, payload);
    return userModified;
  }
  async deleteUser(userId: number): Promise<void> {
    await User.query().where("id", userId).delete();
  }
}
