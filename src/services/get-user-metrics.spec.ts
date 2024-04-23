import { CheckinRepositoryMock } from "@/repositories/mocks/check-in-repository-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics";

let checkInRepository: CheckinRepositoryMock;
let sut: GetUserMetricsService; // sut system under tests

describe("Get User Metrics Service", () => {
  beforeEach(async () => {
    checkInRepository = new CheckinRepositoryMock();
    sut = new GetUserMetricsService(checkInRepository);
  });

  it("should be able to get user-made check-ins", async () => {
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

    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    });

    expect(checkInsCount).toEqual(2);
  });

  it("should be able show user-made checkins", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    });

    expect(checkInsCount).toEqual(22);
  });
});
