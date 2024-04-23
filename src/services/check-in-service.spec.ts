import { MockCheckinRepository } from "@/repositories/mocks/MockCheckInRepository";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { CheckInService } from "./check-in-service";
import { MockGymRepository } from "@/repositories/mocks/MockGymRepository";
import { MaxNumbersOfCheckinsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: MockCheckinRepository;
let gymRepository: MockGymRepository;
let sut: CheckInService; // sut system under tests

describe("Check In Service", () => {
  beforeEach(async () => {
    checkInRepository = new MockCheckinRepository();
    gymRepository = new MockGymRepository();
    sut = new CheckInService(checkInRepository, gymRepository);

    await gymRepository.create({
      id: "gym-1",
      description: "gym js to learn",
      phone: "1234",
      title: "gym js",
      latitude: -24.0086585,
      longitude: -48.3489453,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -24.0086585,
      userLongitude: -48.3489453,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("shouldn't be able to create check-in twice in same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -24.0086585,
      userLongitude: -48.3489453,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-1",
        userId: "user-1",
        userLatitude: -24.0086585,
        userLongitude: -48.3489453,
      }),
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckinsError);
  });

  it("should be able to create check-in twice in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -24.0086585,
      userLongitude: -48.3489453,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -24.0086585,
      userLongitude: -48.3489453,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("shouldn't be able to create check-in on a distant gym", async () => {
    await gymRepository.create({
      id: "gym-2",
      description: "gym 2 js to learn",
      phone: "1234",
      title: "gym 2 js",
      latitude: -23.9120139,
      longitude: -48.1978899,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -24.0086585,
        userLongitude: -48.3489453,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
