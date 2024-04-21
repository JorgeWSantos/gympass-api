import { MockCheckinRepository } from "@/repositories/mocks/MockCheckInRepository";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { CheckInService } from "./check-in-service";
import { MockGymRepository } from "@/repositories/mocks/MockGymRepository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInRepository: MockCheckinRepository;
let gymRepository: MockGymRepository;
let sut: CheckInService; // sut system under tests

describe("Check In Service", () => {
  beforeEach(() => {
    checkInRepository = new MockCheckinRepository();
    gymRepository = new MockGymRepository();
    sut = new CheckInService(checkInRepository, gymRepository);
    gymRepository.items.push({
      id: "gym-1",
      description: "gym js to learn",
      phone: "1234",
      title: "gym js",
      latitude: new Decimal(-24.0086585),
      longitude: new Decimal(-48.3489453),
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
    ).rejects.toBeInstanceOf(Error);
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
    gymRepository.items.push({
      id: "gym-2",
      description: "gym 2 js to learn",
      phone: "1234",
      title: "gym 2 js",
      latitude: new Decimal(-23.9120139),
      longitude: new Decimal(-48.1978899),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -24.0086585,
        userLongitude: -48.3489453,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
