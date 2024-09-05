import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";

export const nearby = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body);

  const service = makeFetchNearbyGymsService();

  const { gyms } = await service.execute({
    user_latitude: latitude,
    user_longitude: longitude,
  });

  return reply.status(200).send({
    gyms,
  });
};
