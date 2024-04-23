import { expect, describe, it, beforeEach } from "vitest";
import { MockGymRepository } from "@/repositories/mocks/MockGymRepository";
import { CreateGymService } from "./create-gym-service";

import("vite");

let gymsRepository: MockGymRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
  beforeEach(() => {
    gymsRepository = new MockGymRepository();
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
