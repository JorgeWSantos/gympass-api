import { CheckinRepositoryMock } from "@/repositories/mocks/check-in-repository-mock";
import { beforeEach, describe, expect, it, afterEach } from "vitest";
import { ValidateCheckInService } from "./validate-check-ins-service";
import ResourceNotFoundError from "./errors/resource-not-found-error";

let checkInRepository: CheckinRepositoryMock;
let sut: ValidateCheckInService; // sut system under tests

describe("Validate Check In Service", () => {
  beforeEach(async () => {
    checkInRepository = new CheckinRepositoryMock();
    sut = new ValidateCheckInService(checkInRepository);

    // vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.useRealTimers();
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
});
