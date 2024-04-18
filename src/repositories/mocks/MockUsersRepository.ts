import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../iusers-repository";

export class MockUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((i) => i.email === email);

    if (!user) {
      return null;
    }

    return user || null;
  }
}