import { Checkin, Prisma } from "@prisma/client";

export interface ICheckInRepository {
  findById(check_in_id: string): Promise<Checkin | null>;
  save(check_in: Checkin): Promise<Checkin>;
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  findByUserIdOnDate(user_id: string, date: Date): Promise<Checkin | null>;
  findManyById(user_id: string, page: number): Promise<Checkin[]>;
  countByUserId(user_id: string): Promise<number>;
}
