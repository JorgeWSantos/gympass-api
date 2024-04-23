import { Checkin, Prisma } from "@prisma/client";
import { ICheckInRepository } from "../icheck-in-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements ICheckInRepository {
  async findById(check_in_id: string) {
    const checkIn = await prisma.checkin.findUnique({
      where: {
        id: check_in_id,
      },
    });

    return checkIn;
  }

  async save(data: Checkin) {
    const checkIn = prisma.checkin.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    });

    return checkIn;
  }

  async findByUserIdOnDate(user_id: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date"); // 2024-03-03T00:00:00
    const endOfTheDay = dayjs(date).endOf("date"); // 2024-03-03T24:00:00

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findManyById(user_id: string, page: number) {
    const checkIns = await prisma.checkin.findMany({
      where: {
        user_id,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }

  async countByUserId(user_id: string) {
    const count = await prisma.checkin.count({
      where: {
        user_id,
      },
    });

    return count;
  }
}
