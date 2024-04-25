import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInService } from "../validate-check-ins-service";

export function makeValidateCheckInsService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const service = new ValidateCheckInService(checkInsRepository);

  return service;
}
