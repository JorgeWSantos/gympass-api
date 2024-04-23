import { CheckinRepositoryMock } from "@/repositories/mocks/check-in-repository-mock";
import { beforeEach, describe, expect, it, afterEach, vi } from "vitest";
import { ValidateCheckInService } from "./validate-check-ins-service";
import ResourceNotFoundError from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInRepository: CheckinRepositoryMock;
let sut: ValidateCheckInService; // sut system under tests

describe("Validate Check In Service", () => {
  beforeEach(async () => {
    checkInRepository = new CheckinRepositoryMock();
    sut = new ValidateCheckInService(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate check-in", async () => {
    const checkInCreated = await checkInRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const { checkIn } = await sut.execute({ checkInId: checkInCreated.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should *not* be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({ checkInId: "non-exist-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should *not* be able to validate check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const checkInCreated = await checkInRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const twentyOneMinutesInMiliseconds = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMiliseconds);

    await expect(() =>
      sut.execute({ checkInId: checkInCreated.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
