import { Checkin } from "@prisma/client";
import { ICheckInRepository } from "@/repositories/icheck-in-repository";

interface FetchUserCheckInHistoryRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInHistoryResponse {
  checkIns: Checkin[];
}

export class FetchUserCheckInHistoryService {
  constructor(private checkInRepository: ICheckInRepository) { }

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryRequest): Promise<FetchUserCheckInHistoryResponse> {
    const checkIns = await this.checkInRepository.findManyById(userId, page);

    return {
      checkIns,
    };
  }
}
