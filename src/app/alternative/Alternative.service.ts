import type { Alternative } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

@injectable()
export class AlternativeService {
  async index() {
    const data = await database.alternative.findMany({
      include: {
        question: true,
        userAnswers: true,
      },
    });

    return data;
  }

  async create(data: Omit<Alternative, "id">) {
    const newAlternative = await database.alternative.create({
      data,
      include: {
        question: true,
      },
    });

    return newAlternative;
  }

  async update(data: Partial<Omit<Alternative, "id">>, id: number) {
    const updatedAlternative = await database.alternative.update({
      data,
      where: { id },
      include: {
        question: true,
      },
    });

    return updatedAlternative;
  }

  async findById(id: number) {
    const alternative = await database.alternative.findUnique({
      where: { id },
      include: {
        question: true,
        userAnswers: true,
      },
    });

    return alternative;
  }

  async delete(id: number) {
    const deletedAlternative = await database.alternative.delete({
      where: { id },
    });

    return deletedAlternative;
  }
}
