import { ICheckInRepository } from "@/repositories/icheck-in-repository";

interface GetUserMetricsServiceRequest {
  userId: string;
}

interface GetUserMetricsServiceResponse {
  checkInsCount: number;
}

export class GetUserMetricsService {
  constructor(private checkInRepository: ICheckInRepository) { }

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
