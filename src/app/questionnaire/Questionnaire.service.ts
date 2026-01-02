import type { Questionnaire } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

@injectable()
export class QuestionnaireService {
  async index() {
    const data = await database.questionnaire.findMany({
      include: {
        class: true,
        createdBy: true,
        questions: {
          include: {
            alternative: true,
          },
        },
      },
    });

    return data;
  }

  async create(data: Omit<Questionnaire, "id" | "createdAt">) {
    const user = await database.user.findUnique({
      where: { id: data.createdById },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.role !== "teacher") {
      throw new Error("Apenas professores podem criar questionários");
    }

    if (data.classId) {
      const classData = await database.class.findUnique({
        where: { id: data.classId },
      });

      if (!classData) {
        throw new Error("Turma não encontrada");
      }
    }

    const newQuestionnaire = await database.questionnaire.create({
      data,
      include: {
        class: true,
        createdBy: true,
        questions: true,
      },
    });

    return newQuestionnaire;
  }

  async update(
    data: Partial<Omit<Questionnaire, "id" | "createdAt">>,
    id: number
  ) {
    const updatedQuestionnaire = await database.questionnaire.update({
      data,
      where: { id },
      include: {
        class: true,
        createdBy: true,
        questions: true,
      },
    });

    return updatedQuestionnaire;
  }

  async findById(id: number) {
    const questionnaire = await database.questionnaire.findUnique({
      where: { id },
      include: {
        class: true,
        createdBy: true,
        questions: {
          include: {
            alternative: true,
          },
        },
      },
    });

    return questionnaire;
  }

  async delete(id: number) {
    const deletedQuestionnaire = await database.questionnaire.delete({
      where: { id },
    });

    return deletedQuestionnaire;
  }
}
