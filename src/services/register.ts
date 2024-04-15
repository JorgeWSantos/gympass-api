import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";
import { IUsersRepository } from "@/repositories/iusers-repository";
import { hash } from "bcryptjs";

interface RegisterServiceRequest {
  email: string;
  name: string;
  password: string;
}

export class RegisterService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ email, name, password }: RegisterServiceRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    });
  }
}
