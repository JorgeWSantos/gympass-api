import { IUsersRepository } from "@/repositories/iusers-repository";
import { User } from "@prisma/client";
import ResourceNotFoundError from "./errors/resource-not-found-error";

interface GetUserProfileServiceRequest {
  userId: string;
}

interface GetUserProfileServiceResponse {
  user: User;
}

export class GetUserProfileService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
