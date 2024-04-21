import { Checkin } from "@prisma/client";
import { ICheckInRepository } from "@/repositories/icheck-in-repository";
import { IGymRepository } from "@/repositories/igym-repository";
import ResourceNotFoundError from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: Checkin;
}

export class CheckInService {
  constructor(
    private checkInRepository: ICheckInRepository,
    private gymRepository: IGymRepository,
  ) { }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
