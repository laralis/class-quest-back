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

  async getAvailableQuestionnaires(studentId: number) {
    // Busca apenas questionários prontos (ready = true) das turmas do aluno
    const enrollments = await database.classStudent.findMany({
      where: { studentId },
      include: {
        class: {
          include: {
            questionnaires: {
              where: { ready: true },
              include: {
                createdBy: true,
                questions: {
                  include: {
                    alternative: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const questionnaires = enrollments.flatMap(
      (enrollment) => enrollment.class.questionnaires
    );

    return questionnaires;
  }

  async create(data: Omit<Questionnaire, "id" | "createdAt">, userId: number) {
    const user = await database.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.role !== "teacher") {
      throw new Error("Apenas professores podem criar questionários");
    }

    // VALIDAÇÃO IMPORTANTE: Verifica se a turma pertence ao professor
    if (data.classId) {
      const classData = await database.class.findUnique({
        where: { id: data.classId },
      });

      if (!classData) {
        throw new Error("Turma não encontrada");
      }

      // SEGURANÇA: Verifica se o professor é o dono da turma
      if (classData.teacherId !== userId) {
        throw new Error(
          "Você não tem permissão para criar questionários nesta turma"
        );
      }
    }

    const newQuestionnaire = await database.questionnaire.create({
      data: {
        ...data,
        createdById: userId, // Usa o ID do token, não do body
      },
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
