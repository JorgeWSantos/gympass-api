import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { hash } from "bcryptjs";

interface RegisterServiceRequest {
  email: string;
  name: string;
  password: string;
}

export async function registerService({
  email,
  name,
  password,
}: RegisterServiceRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error("E-mail already exists!");
  }

  const password_hash = await hash(password, 6);

  const prismaUsersRepository = new PrismaUsersRepository();

  await prismaUsersRepository.create({
    email,
    name,
    password_hash,
  });
}
