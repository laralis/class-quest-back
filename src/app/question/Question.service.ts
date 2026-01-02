import type { Question } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

@injectable()
export class QuestionService {
  async index() {
    const data = await database.question.findMany({
      include: {
        questionnaire: true,
        alternative: true,
        userAnswers: true,
      },
    });

    return data;
  }

  async create(data: Omit<Question, "id">) {
    const existingQuestionsCount = await database.question.count({
      where: { questionnaireId: data.questionnaireId },
    });

    if (existingQuestionsCount >= 5) {
      throw new Error(
        "Não é possível adicionar mais de 5 questões por questionário"
      );
    }

    const newQuestion = await database.question.create({
      data,
      include: {
        questionnaire: true,
        alternative: true,
      },
    });

    return newQuestion;
  }

  async update(data: Partial<Omit<Question, "id">>, id: number) {
    const updatedQuestion = await database.question.update({
      data,
      where: { id },
      include: {
        questionnaire: true,
        alternative: true,
      },
    });

    return updatedQuestion;
  }

  async findById(id: number) {
    const question = await database.question.findUnique({
      where: { id },
      include: {
        questionnaire: true,
        alternative: true,
        userAnswers: true,
      },
    });

    return question;
  }

  async delete(id: number) {
    const deletedQuestion = await database.question.delete({
      where: { id },
    });

    return deletedQuestion;
  }
}
