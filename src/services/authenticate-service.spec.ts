import { MockUsersRepository } from "@/repositories/mocks/MockUsersRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateService } from "./authentication-service";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { hash } from "bcryptjs";

let usersRepository: MockUsersRepository;
let sut: AuthenticateService; // sut system under tests

describe("Authenticate Service", () => {
  beforeEach(() => {
    usersRepository = new MockUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });

  it("should be able to authenticate user", async () => {
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
    await expect(() =>
      sut.execute({
        email: "wrongemail@gmail.com",
        password: "13",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("shouldn't be possible authenticate user with wrong password", async () => {
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

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "13",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
