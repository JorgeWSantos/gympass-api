import { Prisma, Gym } from "@prisma/client";

export interface findManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface IGymRepository {
  findById(gym_id: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(params: findManyNearbyParams): Promise<Gym[]>;
}
