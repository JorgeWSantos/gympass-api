import { expect, describe, it } from "vitest";
import { RegisterService } from "./register-service";
import { compare } from "bcryptjs";
import { MockUsersRepository } from "@/repositories/mocks/MockUsersRepository";
import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";

import("vite");

describe("Register Use Case", () => {
  it("should be able to create user", async () => {
    const usersRepository = new MockUsersRepository();
    const registerUseCase = new RegisterService(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new MockUsersRepository();
    const registerUseCase = new RegisterService(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    });

    const isPasswordCorrectlyHashed = await compare("123", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shouldn't be possible register two users with same email", async () => {
    const usersRepository = new MockUsersRepository();
    const registerUseCase = new RegisterService(usersRepository);

    const email = "jhondoe@gamil.com";

    await registerUseCase.execute({
      name: "johndoe",
      email,
      password: "123",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "johndoe",
        email,
        password: "123",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
