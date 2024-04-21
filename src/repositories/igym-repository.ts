import { Gym } from "@prisma/client";

export interface IGymRepository {
  findById(gym_id: string): Promise<Gym | null>;
}
