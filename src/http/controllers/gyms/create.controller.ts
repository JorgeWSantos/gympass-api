import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateGymsService } from "@/services/factories/make-create-gym-service";

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { description, latitude, longitude, phone, title } =
    createGymBodySchema.parse(request.body);

  const service = makeCreateGymsService();

  await service.execute({ description, latitude, longitude, phone, title });

  return reply.status(201).send();
};
