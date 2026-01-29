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

  async calculateClassGrade(studentId: number, classId: number) {
    // Buscar informações da turma
    const classData = await database.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      throw new Error("Class not found");
    }

    // Buscar todos os questionários da turma
    const questionnaires = await database.questionnaire.findMany({
      where: { classId },
      include: {
        questions: {
          include: {
            userAnswers: {
              where: { studentId },
              include: { alternative: true },
            },
          },
        },
      },
    });

    let totalEarnedPoints = 0;
    let totalPossiblePoints = 0;

    const questionnaireResults = questionnaires.map((questionnaire) => {
      let earnedPoints = 0;
      let totalPoints = 0;

      questionnaire.questions.forEach((question) => {
        totalPoints += question.value;

        const userAnswer = question.userAnswers[0];
        if (userAnswer && userAnswer.alternative.correct) {
          earnedPoints += question.value;
        }
      });

      totalEarnedPoints += earnedPoints;
      totalPossiblePoints += totalPoints;

      return {
        questionnaireId: questionnaire.id,
        questionnaireTitle: questionnaire.title,
        earnedPoints,
        totalPoints,
        percentage: totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0,
      };
    });

    const finalGrade =
      totalPossiblePoints > 0
        ? (totalEarnedPoints / totalPossiblePoints) * 10
        : 0;

    return {
      studentId,
      classId,
      questionnaires: questionnaireResults,
      totalEarnedPoints,
      totalPossiblePoints,
      finalGrade: Number(finalGrade.toFixed(2)),
    };
  }

  async delete(id: number) {
    const deletedUserAnswer = await database.userAnswer.delete({
      where: { id },
    });

    return deletedUserAnswer;
  }
}
