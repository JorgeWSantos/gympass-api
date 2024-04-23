import { IGymRepository } from "@/repositories/igym-repository";
import { Gym } from "@prisma/client";

interface SearchGymServiceRequest {
  query: string;
  page: number;
}

interface SearchGymServiceResponse {
  gym: Gym[];
}

export class SearchGymService {
  constructor(private gymRepository: IGymRepository) { }

  async execute({
    query,
    page,
  }: SearchGymServiceRequest): Promise<SearchGymServiceResponse> {
    const gym = await this.gymRepository.searchMany(query, page);

    return { gym };
  }
}
