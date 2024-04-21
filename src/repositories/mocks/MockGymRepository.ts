import { Gym } from "@prisma/client";
import { IGymRepository } from "../igym-repository";

export class MockGymRepository implements IGymRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((i) => i.id === id);

    if (!gym) {
      return null;
    }

    return gym || null;
  }
}
