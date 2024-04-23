import { IGymRepository } from "@/repositories/igym-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymServiceRequest {
  user_latitude: number;
  user_longitude: number;
}

interface FetchNearbyGymServiceResponse {
  gyms: Gym[];
}

export class FetchNearbyGymService {
  constructor(private gymRepository: IGymRepository) { }

  async execute({
    user_latitude,
    user_longitude,
  }: FetchNearbyGymServiceRequest): Promise<FetchNearbyGymServiceResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: user_latitude,
      longitude: user_longitude,
    });

    return { gyms };
  }
}
