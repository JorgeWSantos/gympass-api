import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { IUsersRepository } from "@/repositories/iusers-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";

interface RegisterServiceRequest {
  email: string;
  name: string;
  password: string;
}

interface RegisterServiceResponse {
  user: User;
}

export class RegisterService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
