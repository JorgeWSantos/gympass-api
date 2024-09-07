import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authenticateBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    const service = makeAuthenticateService();

    const { user } = await service.execute({ email, password });

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true, // o frontend cannot read this information
        sameSite: true, // cookie can be only accessed on this site
        httpOnly: true, // this cookie just can be accessed by the server
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(400).send({ message: error.message });

    return reply.status(500).send({ message2: error.message }); // TODO:
  }
};
