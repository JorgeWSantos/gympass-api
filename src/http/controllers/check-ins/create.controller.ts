import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCheckInService } from "@/services/factories/make-check-in-service";

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const service = makeCheckInService();

  await service.execute({
    gymId,
    userId: request.user.sub,
    latitude,
    longitude,
  });

  return reply.status(201).send();
};
