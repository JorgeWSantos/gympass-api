import { expect, describe, it, beforeEach } from "vitest";
import { GymRepositoryMock } from "@/repositories/mocks/gyms-repository-mock";
import { FetchNearbyGymService } from "./fetch-nearby-gyms-service";

let gymsRepository: GymRepositoryMock;
let sut: FetchNearbyGymService;

describe("Search Gym Service", () => {
  beforeEach(() => {
    gymsRepository = new GymRepositoryMock();
    sut = new FetchNearbyGymService(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      description: "Near Gym",
      latitude: -24.0036205,
      longitude: -48.3474345,
      phone: "15998320554",
      title: "gym",
    });

    await gymsRepository.create({
      description: "Far Gym",
      latitude: -23.8668289,
      longitude: -48.1706125,
      phone: "15998320554",
      title: "gym",
    });

    // my location
    const { gyms } = await sut.execute({
      user_latitude: -24.0029295,
      user_longitude: -48.3365447,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "gym" })]);
  });
});
