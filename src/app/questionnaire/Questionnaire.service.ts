import type { Questionnaire } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

interface StudentGrade {
  studentId: string;
  studentName: string;
  grade: number | null;
  answeredAt: string | null;
}

interface TeacherQuestionnaireHistory {
  questionnaireId: string;
  title: string;
  description: string;
  createdAt: string;
  totalStudents: number;
  answeredCount: number;
  students: StudentGrade[];
}

interface ClassQuestionnairesResponse {
  classId: string;
  className: string;
  totalStudents: number;
  questionnaires: TeacherQuestionnaireHistory[];
}

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
      (enrollment) => enrollment.class.questionnaires,
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

    if (data.classId) {
      const classData = await database.class.findUnique({
        where: { id: data.classId },
      });

      if (!classData) {
        throw new Error("Turma não encontrada");
      }

      if (classData.teacherId !== userId) {
        throw new Error(
          "Você não tem permissão para criar questionários nesta turma",
        );
      }
    }

    const newQuestionnaire = await database.questionnaire.create({
      data: {
        ...data,
        createdById: userId,
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
    id: number,
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

  async getQuestionnaireGrades(
    classId: number,
    teacherId: number,
  ): Promise<ClassQuestionnairesResponse> {
    const classData = await database.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: {
            student: true,
          },
        },
        questionnaires: {
          include: {
            results: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    if (!classData) {
      throw new Error("Turma não encontrada");
    }

    if (classData.teacherId !== teacherId) {
      throw new Error("Você não tem permissão para acessar esta turma");
    }

    const questionnaires: TeacherQuestionnaireHistory[] =
      classData.questionnaires.map((questionnaire) => {
        const students: StudentGrade[] = classData.students.map(
          (enrollment) => {
            const result = questionnaire.results.find(
              (r) => r.studentId === enrollment.studentId,
            );

            return {
              studentId: enrollment.student.id.toString(),
              studentName: enrollment.student.name,
              grade: result?.points ?? null,
              answeredAt: result?.finalizedAt?.toISOString() ?? null,
            };
          },
        );

        return {
          questionnaireId: questionnaire.id.toString(),
          title: questionnaire.title,
          description: questionnaire.description ?? "",
          createdAt: questionnaire.createdAt.toISOString(),
          totalStudents: classData.students.length,
          answeredCount: questionnaire.results.length,
          students,
        };
      });

    return {
      classId: classData.id.toString(),
      className: classData.name,
      totalStudents: classData.students.length,
      questionnaires,
    };
  }
}
