import { HttpContext } from "@adonisjs/core/http";
import { inject } from "@adonisjs/core";
import UserService from "#services/userService";
import CreateUserPayload from "#models/user/createUserPayload";
import UpdateUserPayload from "#models/user/updateUserPayload";

@inject()
export default class UserController {
  constructor(private userService: UserService) {}

  async create({ request, response }): Promise<HttpContext> {
    const payload: CreateUserPayload = request.only([
      "fullName",
      "email",
      "password",
    ]);

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return response.badRequest({ message: "Invalid email format" });
    }

    if (await this.userService.getUserByEmail(payload.email)) {
      return response.badRequest({ message: "Email is already in use" });
    }

    if (!payload.password || payload.password.length < 8) {
      return response.badRequest({
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await this.userService.createUser(payload);
    return response.created(user);
  }

  async delete({ params, response }): Promise<HttpContext> {
    const userId = params.id;

    if (!userId) {
      return response.status(400).send({ error: "User ID is required" });
    }

    try {
      const user = await this.userService.getUserById(userId);
      await this.userService.deleteUser(userId);
      return response.send(user);
    } catch (error) {
      return response.status(404).send({ error: "User not found" });
    }
  }

  async getAll({ response }): Promise<HttpContext> {
    try {
      const users = await this.userService.getAllUsers();
      const usersJson = users.map((user) => user);

      return response.send(usersJson);
    } catch (error) {
      return response.status(404).send({ error: "Users not found" });
    }
  }

  async getUserByEmail({ request, response }): Promise<HttpContext> {
    const userEmail = request.qs().email;

    if (!userEmail) {
      return response.status(400).send({ error: "User email is required" });
    }

    try {
      const user = await this.userService.getUserByEmail(userEmail);
      if (!user) {
        return response.status(404).send({ error: "User not found" });
      }
      return response.send(user);
    } catch (error) {
      return response.status(404).send({ error: "User not found" });
    }
  }

  async getUserById({ params, response }): Promise<HttpContext> {
    const userId = params.id;

    if (!userId) {
      return response.status(400).send({ error: "User ID is required" });
    }

    try {
      const user = await this.userService.getUserById(userId);
      return response.send(user);
    } catch (error) {
      return response.status(404).send({ error: "User not found" });
    }
  }

  async update({ request, response }): Promise<HttpContext> {
    const { id, fullName, email } = request.only(["id", "fullName", "email"]);

    if (!id || isNaN(Number(id))) {
      return response.badRequest({
        message: "User ID is required and must be a number",
      });
    }

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return response.badRequest({ message: "Invalid email format" });
      }
    }

    const payload: UpdateUserPayload = {};
    if (fullName) payload.fullName = fullName;
    if (email) payload.email = email;

    try {
      const user = await this.userService.updateUser(id, payload);
      return response.created(user);
    } catch (error) {
      return response.internalServerError({
        message: "Failed to update user",
        error,
      });
    }
  }
}
