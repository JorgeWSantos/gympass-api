import { Gym, Prisma } from "@prisma/client";
import { IGymRepository, findManyNearbyParams } from "../igym-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

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

  async searchMany(query: string, page: number) {
    const totalPages = 20;

    const gym = this.items
      .filter((i) => i.title.includes(query))
      .slice((page - 1) * totalPages, page * totalPages);

    return gym;
  }

  async findManyNearby(params: findManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      );

      return distance < 10;
    });
  }
}
