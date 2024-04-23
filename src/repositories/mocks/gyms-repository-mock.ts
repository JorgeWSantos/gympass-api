import { Gym, Prisma } from "@prisma/client";
import { IGymRepository } from "../igym-repository";
import { randomUUID } from "node:crypto";

export class GymRepositoryMock implements IGymRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.items.find((i) => i.id === id);

    if (!gym) {
      return null;
    }

    return gym || null;
  }
}
