import { FastifyRequest, FastifyReply } from "fastify";

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify({ onlyCookie: true });

  const { role, sub } = request.user;

  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub,
      },
    },
  );

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub,
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
};
