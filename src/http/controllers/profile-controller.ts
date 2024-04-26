import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyRequest, FastifyReply } from "fastify";
// import { z } from "zod";
// import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
// import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  // try {
  //   const authenticateBodySchema = z.object({
  //     email: z.string(),
  //     password: z.string(),
  //   });

  //   const { email, password } = authenticateBodySchema.parse(request.body);

  //   const service = makeAuthenticateService();

  //   await service.execute({ email, password });

  const userId = request.user.sub;

  const service = makeGetUserProfileService();
  const { user } = await service.execute({ userId });

  return reply.status(200).send({ ...user, passaword_hash: undefined });
  // } catch (error) {
  //   if (error instanceof InvalidCredentialsError)
  //     return reply.status(400).send({ message: error.message });

  //   return reply.status(500).send({ message2: error.message }); // TODO:
  // }
};
