import { expect, describe, it, beforeEach } from "vitest";
import { GymRepositoryMock } from "@/repositories/mocks/gyms-repository-mock";
import { CreateGymService } from "./create-gym-service";

import("vite");

let gymsRepository: GymRepositoryMock;
let sut: CreateGymService;

describe("Create Gym Service", () => {
  beforeEach(() => {
    gymsRepository = new GymRepositoryMock();
    sut = new CreateGymService(gymsRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      description: "teste",
      latitude: -27.5532432,
      longitude: -28.5532432,
      phone: "15998320554",
      title: "testss",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
