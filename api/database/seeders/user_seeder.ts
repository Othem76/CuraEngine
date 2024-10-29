import { BaseSeeder } from "@adonisjs/lucid/seeders";
import User from "#models/user/user";
import Hash from "@adonisjs/core/services/hash";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        fullName: "John Doe",
        email: "john@example.com",
        password: await Hash.make("password123"),
      },
      {
        fullName: "Jane Smith",
        email: "jane@example.com",
        password: await Hash.make("password123"),
      },
    ]);
  }
}
