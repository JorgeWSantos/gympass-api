import { Checkin, Prisma } from "@prisma/client";

export interface ICheckInRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>;
}