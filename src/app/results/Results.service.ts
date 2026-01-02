import type { Results } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

@injectable()
export class ResultsService {
  async index() {
    const data = await database.results.findMany({
      include: {
        student: true,
      },
    });

    return data;
  }

  async create(data: Omit<Results, "id" | "finalizedAt">) {
    const newResult = await database.results.create({
      data,
      include: {
        student: true,
      },
    });

    return newResult;
  }

  async update(data: Partial<Omit<Results, "id" | "finalizedAt">>, id: number) {
    const updatedResult = await database.results.update({
      data,
      where: { id },
      include: {
        student: true,
      },
    });

    return updatedResult;
  }

  async findById(id: number) {
    const result = await database.results.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    return result;
  }

  async findByStudent(studentId: number) {
    const results = await database.results.findMany({
      where: { studentId },
      include: {
        student: true,
      },
      orderBy: { finalizedAt: "desc" },
    });

    return results;
  }

  async delete(id: number) {
    const deletedResult = await database.results.delete({
      where: { id },
    });

    return deletedResult;
  }
}
