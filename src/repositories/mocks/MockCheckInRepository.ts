import { Checkin, Prisma } from "@prisma/client";
import { ICheckInRepository } from "../icheck-in-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class MockCheckinRepository implements ICheckInRepository {
  public items: Checkin[] = [];

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date"); // 2024-03-03T00:00:00
    const endOfTheDay = dayjs(date).endOf("date"); // 2024-03-03T24:00:00

    const checkOnSameDate = this.items.find((c) => {
      const checkInDate = dayjs(c.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return c.user_id === userId && isOnSameDate;
    });

    if (!checkOnSameDate) {
      return null;
    }

    return checkOnSameDate;
  }
}
