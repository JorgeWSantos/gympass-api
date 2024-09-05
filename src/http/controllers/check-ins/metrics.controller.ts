import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = makeGetUserMetricsService();

  const { checkInsCount } = await service.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkInsCount,
  });
};
