import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeValidateCheckInsService } from "@/services/factories/make-validate-check-ins-service";

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.query);

  const service = makeValidateCheckInsService();

  await service.execute({
    checkInId,
  });

  return reply.status(204).send();
};
