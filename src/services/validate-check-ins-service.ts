import { Checkin } from "@prisma/client";
import { ICheckInRepository } from "@/repositories/icheck-in-repository";
import ResourceNotFoundError from "./errors/resource-not-found-error";

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: Checkin;
}

export class ValidateCheckInService {
  constructor(private checkInRepository: ICheckInRepository) { }

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
