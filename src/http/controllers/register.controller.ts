import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { registerService } from "@/services/register";

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

    await registerService({ email, name, password });

    return reply.status(201).send();
  } catch (error) {
    return reply.status(409).send();
  }
};
