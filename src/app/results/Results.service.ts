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

  async calculateStudentGrade(classId: number, studentId: number) {
    const classData = await database.class.findUnique({
      where: { id: classId },
    });
    if (!classData) {
      throw new Error("Class not found");
    }

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

    return this._processStudentGrade(studentId, classId, questionnaires);
  }

  async calculateAllStudentsGrades(classId: number) {
    const classData = await database.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!classData) {
      throw new Error("Class not found");
    }

    if (classData.students.length === 0) {
      return [];
    }

    const questionnaires = await database.questionnaire.findMany({
      where: { classId },
      include: {
        questions: {
          include: {
            userAnswers: {
              where: {
                studentId: { in: classData.students.map((s) => s.studentId) },
              },
              include: { alternative: true },
            },
          },
        },
      },
    });

    return classData.students.map((classStudent) => {
      const studentQuestionnaires = questionnaires.map((q) => ({
        ...q,
        questions: q.questions.map((question) => ({
          ...question,
          userAnswers: question.userAnswers.filter(
            (ua) => ua.studentId === classStudent.studentId,
          ),
        })),
      }));

      const gradeData = this._processStudentGrade(
        classStudent.studentId,
        classId,
        studentQuestionnaires,
      );

      return {
        ...gradeData,
        studentName: classStudent.student.name,
        studentEmail: classStudent.student.email,
      };
    });
  }

  private _processStudentGrade(
    studentId: number,
    classId: number,
    questionnaires: any[],
  ) {
    let totalEarnedPoints = 0;
    let totalPossiblePoints = 0;

    const questionnaireResults = questionnaires.map((questionnaire) => {
      let earnedPoints = 0;
      let totalPoints = 0;

      questionnaire.questions.forEach((question: any) => {
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
}
