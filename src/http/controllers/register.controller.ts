import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { RegisterService } from "@/services/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string().min(6),
    });

    const { email, name, password } = userBodySchema.parse(request.body);

    const usersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRepository);

    await registerService.execute({ email, name, password });

    return reply.status(201).send();
  } catch (error) {
    return reply.status(409).send();
  }
};
