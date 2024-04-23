import { expect, describe, it, beforeEach } from "vitest";
import { GymRepositoryMock } from "@/repositories/mocks/gyms-repository-mock";
import { SearchGymService } from "./search-gym-service";

let gymsRepository: GymRepositoryMock;
let sut: SearchGymService;

describe("Search Gym Service", () => {
  beforeEach(() => {
    gymsRepository = new GymRepositoryMock();
    sut = new SearchGymService(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      description: "gym",
      latitude: -27.5532432,
      longitude: -28.5532432,
      phone: "15998320554",
      title: "gym",
    });

    await gymsRepository.create({
      description: "gimmer",
      latitude: -27.5532432,
      longitude: -28.5532432,
      phone: "15998320554",
      title: "gimmer",
    });

    const { gym } = await sut.execute({ query: "gym", page: 1 });

    expect(gym).toHaveLength(1);
    expect(gym).toEqual([expect.objectContaining({ title: "gym" })]);
  });

  it("should be able to search a gym by page", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        description: `gym-${i}`,
        latitude: -27.5532432,
        longitude: -28.5532432,
        phone: "15998320554",
        title: `gym-${i}`,
      });
    }

    const { gym } = await sut.execute({ query: "gym", page: 2 });

    expect(gym).toHaveLength(2);
    expect(gym).toEqual([
      expect.objectContaining({ title: "gym-21" }),
      expect.objectContaining({ title: "gym-22" }),
    ]);
  });
});
