import { Checkin, Prisma } from "@prisma/client";

export interface ICheckInRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  findByUserIdOnDate(user_id: string, date: Date): Promise<Checkin | null>;
  findManyById(user_id: string, page: number): Promise<Checkin[]>;
  countByUserId(user_id: string): Promise<number>;
}
