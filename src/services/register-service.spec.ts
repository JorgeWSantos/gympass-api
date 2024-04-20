import { expect, describe, it, beforeEach } from "vitest";
import { RegisterService } from "./register-service";
import { compare } from "bcryptjs";
import { MockUsersRepository } from "@/repositories/mocks/MockUsersRepository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

import("vite");

let usersRepository: MockUsersRepository;
let sut: RegisterService;

describe("Register Service", () => {
  beforeEach(() => {
    usersRepository = new MockUsersRepository();
    sut = new RegisterService(usersRepository);
  });

  it("should be able to create user", async () => {
    const { user } = await sut.execute({
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    });

    const isPasswordCorrectlyHashed = await compare("123", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shouldn't be possible register two users with same email", async () => {
    const email = "jhondoe@gamil.com";

    await sut.execute({
      name: "johndoe",
      email,
      password: "123",
    });

    await expect(() =>
      sut.execute({
        name: "johndoe",
        email,
        password: "123",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
