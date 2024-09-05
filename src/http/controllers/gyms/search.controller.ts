import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchGymService } from "@/services/factories/make-search-gyms-service";

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsQuerySchema.parse(request.query);

  const service = makeSearchGymService();

  const { gyms } = await service.execute({ query, page });

  return reply.status(200).send({
    gyms,
  });
};
