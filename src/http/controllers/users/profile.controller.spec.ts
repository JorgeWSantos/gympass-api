import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const authMe = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(authMe.statusCode).toEqual(200);
    expect(authMe.body).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      }),
    );
  });
});
