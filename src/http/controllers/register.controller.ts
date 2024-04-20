import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeRegisterService } from "@/services/factories/make-register-service";

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

    const service = makeRegisterService();

    await service.execute({ email, name, password });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: error.message });

    return reply.status(500).send(); // TODO:
  }
};
