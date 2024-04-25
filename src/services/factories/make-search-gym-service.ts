import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymService } from "../search-gym-service";

export function makeSearchGymService() {
  const gymsRepository = new PrismaGymsRepository();
  const service = new SearchGymService(gymsRepository);

  return service;
}
