import { Prisma, Gym } from "@prisma/client";

export interface IGymRepository {
  findById(gym_id: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
