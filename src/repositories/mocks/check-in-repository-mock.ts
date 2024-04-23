import { Checkin, Prisma } from "@prisma/client";
import { ICheckInRepository } from "../icheck-in-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class CheckinRepositoryMock implements ICheckInRepository {
  public items: Checkin[] = [];

  async findById(check_in_id: string) {
    const checkIn = this.items.find((c) => c.id === check_in_id);

    return checkIn ?? null;
  }

  async save(check_in: Checkin) {
    const checkInIndex = this.items.findIndex((c) => c.id === check_in.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = check_in;
    }

    return check_in;
  }

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

  async findManyById(user_id: string, page: number) {
    const totalPages = 20;
    return this.items
      .filter((c) => c.user_id === user_id)
      .slice((page - 1) * totalPages, page * totalPages);
  }

  async findByUserIdOnDate(user_id: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date"); // 2024-03-03T00:00:00
    const endOfTheDay = dayjs(date).endOf("date"); // 2024-03-03T24:00:00

    const checkOnSameDate = this.items.find((c) => {
      const checkInDate = dayjs(c.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return c.user_id === user_id && isOnSameDate;
    });

    if (!checkOnSameDate) {
      return null;
    }

    return checkOnSameDate;
  }

  async countByUserId(user_id: string) {
    return this.items.filter((c) => c.user_id === user_id).length;
  }
}
