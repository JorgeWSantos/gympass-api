import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Near Gym",
        latitude: -24.0036205,
        longitude: -48.3474345,
        phone: "15990554",
        title: "Javascript Gym",
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Far Gym",
        latitude: -23.8668289,
        longitude: -48.1706125,
        phone: "159983254",
        title: "Typescript Gym",
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -24.0036205,
        longitude: -48.3474345,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym",
      }),
    ]);
  });
});
