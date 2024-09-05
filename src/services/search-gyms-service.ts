import { IGymRepository } from "@/repositories/igym-repository";
import { Gym } from "@prisma/client";

interface SearchGymServiceRequest {
  query: string;
  page: number;
}

interface SearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymService {
  constructor(private gymRepository: IGymRepository) { }

  async execute({
    query,
    page,
  }: SearchGymServiceRequest): Promise<SearchGymsServiceResponse> {
    const gyms = await this.gymRepository.searchMany(query, page);

    return { gyms };
  }
}
