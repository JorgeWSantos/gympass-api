import { UsersRepositoryMock } from "@/repositories/mocks/user-repository-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileService } from "./get-user-profile-service";
import { hash } from "bcryptjs";
import ResourceNotFoundError from "./errors/resource-not-found-error";

let usersRepository: UsersRepositoryMock;
let sut: GetUserProfileService; // sut system under tests

describe("Get User Profile", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryMock();
    sut = new GetUserProfileService(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const newUser = {
      name: "johndoe",
      email: "jhondoe@gmail.com",
      password: "123",
    };

    const userSearched = await usersRepository.create({
      email: newUser.email,
      name: newUser.name,
      password_hash: await hash(newUser.password, 6),
    });

    const { user } = await sut.execute({ userId: userSearched.id });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should be able to get user profile", async () => {
    await expect(() =>
      sut.execute({ userId: "user-non-exists-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
