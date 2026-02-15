import type { UserAnswer } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

@injectable()
export class UserAnswerService {
  async index() {
    const data = await database.userAnswer.findMany({
      include: {
        student: true,
        alternative: true,
        question: true,
      },
    });

    return data;
  }

  async create(data: Omit<UserAnswer, "id" | "responseDate">) {
    const newUserAnswer = await database.userAnswer.create({
      data,
      include: {
        student: true,
        alternative: true,
        question: true,
      },
    });

    return newUserAnswer;
  }

  async update(
    data: Partial<Omit<UserAnswer, "id" | "responseDate">>,
    id: number,
  ) {
    const updatedUserAnswer = await database.userAnswer.update({
      data,
      where: { id },
      include: {
        student: true,
        alternative: true,
        question: true,
      },
    });

    return updatedUserAnswer;
  }

  async findById(id: number) {
    const userAnswer = await database.userAnswer.findUnique({
      where: { id },
      include: {
        student: true,
        alternative: true,
        question: true,
      },
    });

    return userAnswer;
  }

  async findByStudent(studentId: number) {
    return await database.userAnswer.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        question: {
          include: {
            questionnaire: {
              select: {
                id: true,
                title: true,
                createdAt: true,
              },
            },
          },
        },
        alternative: true,
      },
      orderBy: {
        responseDate: "desc",
      },
    });
  }

  async delete(id: number) {
    const deletedUserAnswer = await database.userAnswer.delete({
      where: { id },
    });

    return deletedUserAnswer;
  }
}
