import type { Class } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";

@injectable()
export class ClassService {
  async index() {
    const data = await database.class.findMany({
      include: {
        teacher: true,
        students: {
          include: {
            student: true,
          },
        },
        questionnaires: true,
      },
    });

    return data;
  }

  async create(data: Omit<Class, "id" | "createdAt">) {
    const teacher = await database.user.findUnique({
      where: { id: data.teacherId },
    });

    if (!teacher) {
      throw new Error("Professor não encontrado");
    }

    if (teacher.role !== "teacher") {
      throw new Error(
        "Apenas usuários com papel de professor podem criar turmas"
      );
    }

    const newClass = await database.class.create({
      data,
      include: {
        teacher: true,
        students: true,
      },
    });

    return newClass;
  }

  async update(data: Partial<Omit<Class, "id" | "createdAt">>, id: number) {
    if (data.teacherId) {
      const teacher = await database.user.findUnique({
        where: { id: data.teacherId },
      });

      if (!teacher) {
        throw new Error("Professor não encontrado");
      }

      if (teacher.role !== "teacher") {
        throw new Error(
          "Apenas usuários com papel de professor podem ser responsáveis por turmas"
        );
      }
    }

    const updatedClass = await database.class.update({
      data,
      where: { id },
      include: {
        teacher: true,
        students: true,
      },
    });

    return updatedClass;
  }

  async findById(id: number) {
    const classData = await database.class.findUnique({
      where: { id },
      include: {
        teacher: true,
        students: {
          include: {
            student: true,
          },
        },
        questionnaires: true,
      },
    });

    return classData;
  }

  async delete(id: number) {
    const deletedClass = await database.class.delete({
      where: { id },
    });

    return deletedClass;
  }

  async addAluno(classId: number, studentId: number) {
    const classStudent = await database.classStudent.create({
      data: {
        classId,
        studentId,
      },
      include: {
        class: true,
        student: true,
      },
    });

    return classStudent;
  }

  async list() {
    const classes = await database.class.findMany({
      include: {
        teacher: true,
        students: {
          include: {
            student: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    return classes;
  }

  async enterByCode(accessCode: string, studentId: number) {
    const classData = await database.class.findUnique({
      where: { accessCode },
    });

    if (!classData) {
      throw new Error("Turma não encontrada com este código de acesso");
    }

    const existingEnrollment = await database.classStudent.findFirst({
      where: {
        classId: classData.id,
        studentId,
      },
    });

    if (existingEnrollment) {
      throw new Error("Aluno já está matriculado nesta turma");
    }

    const enrollment = await database.classStudent.create({
      data: {
        classId: classData.id,
        studentId,
      },
      include: {
        class: true,
        student: true,
      },
    });

    return enrollment;
  }
}
