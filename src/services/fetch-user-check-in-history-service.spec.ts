import { CheckinRepositoryMock } from "@/repositories/mocks/check-in-repository-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInHistoryService } from "./fetch-user-check-in-history-service";

let checkInRepository: CheckinRepositoryMock;
let sut: FetchUserCheckInHistoryService; // sut system under tests

describe("Check In Service", () => {
  beforeEach(async () => {
    checkInRepository = new CheckinRepositoryMock();
    sut = new FetchUserCheckInHistoryService(checkInRepository);
  });

  it("should be able to fetch check-ins history", async () => {
    await checkInRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    await checkInRepository.create({
      gym_id: "gym-2",
      user_id: "user-1",
    });

    await checkInRepository.create({
      gym_id: "gym-1",
      user_id: "user-2",
    });

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-1" }),
      expect.objectContaining({ gym_id: "gym-2" }),
    ]);
  });

  it("should be able to fetch *paginated* check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
