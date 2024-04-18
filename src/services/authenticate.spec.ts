import { MockUsersRepository } from "@/repositories/mocks/MockUsersRepository";
import { describe, expect, it } from "vitest";
import { AuthenticateService } from "./authentication-service";
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { hash } from "bcryptjs";

describe("Authenticate Service", () => {
  it("should be able to authenticate user", async () => {
    const usersRepository = new MockUsersRepository();
    // sut system under tests
    const sut = new AuthenticateService(usersRepository);

    const user = {
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    };

    await usersRepository.create({
      email: user.email,
      name: user.name,
      password_hash: await hash(user.password, 6),
    });

    const { user: userCreated } = await sut.execute({
      email: user.email,
      password: "123",
    });

    expect(userCreated.id).toEqual(expect.any(String));
  });

  it("shouldn't be possible authenticate user with wrong email", async () => {
    const usersRepository = new MockUsersRepository();

    const sut = new AuthenticateService(usersRepository);

    await expect(() =>
      sut.execute({
        email: "wrongemail@gmail.com",
        password: "13",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("shouldn't be possible authenticate user with wrong password", async () => {
    const usersRepository = new MockUsersRepository();

    const user = {
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    };

    await usersRepository.create({
      email: user.email,
      name: user.name,
      password_hash: await hash(user.password, 6),
    });

    const sut = new AuthenticateService(usersRepository);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "13",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
