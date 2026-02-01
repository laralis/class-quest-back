import type { Class } from "@prisma/client";
import { database } from "../../database/index";
import { injectable } from "tsyringe";
import { customAlphabet } from "nanoid";

@injectable()
export class ClassService {
  private generateAccessCode(): string {
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
    return nanoid();
  }

  private async generateUniqueAccessCode(): Promise<string> {
    let code = this.generateAccessCode();
    let exists = await database.class.findUnique({
      where: { accessCode: code },
    });

    while (exists) {
      code = this.generateAccessCode();
      exists = await database.class.findUnique({
        where: { accessCode: code },
      });
    }

    return code;
  }

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

  async create(
    data: Omit<Class, "id" | "createdAt" | "accessCode" | "logoUrl">,
    imageFile?: Express.Multer.File,
    protocol?: string,
    host?: string,
  ) {
    const teacher = await database.user.findUnique({
      where: { id: data.teacherId },
    });

    if (!teacher) {
      throw new Error("Professor não encontrado");
    }

    if (teacher.role !== "teacher") {
      throw new Error(
        "Apenas usuários com papel de professor podem criar turmas",
      );
    }

    let logoUrl: string | undefined;
    if (imageFile && protocol && host) {
      logoUrl = `${protocol}://${host}/uploads/${imageFile.filename}`;
    }

    const accessCode = await this.generateUniqueAccessCode();

    const newClass = await database.class.create({
      data: {
        ...data,
        accessCode,
        logoUrl,
      },
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
          "Apenas usuários com papel de professor podem ser responsáveis por turmas",
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

  async findByAccessCode(accessCode: string) {
    const classData = await database.class.findUnique({
      where: { accessCode },
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

  async addAlunoByEmail(classId: number, email: string) {
    const student = await database.user.findUnique({
      where: { email },
    });

    if (!student) {
      throw new Error("Aluno não encontrado com este email");
    }

    if (student.role !== "student") {
      throw new Error("O usuário encontrado não é um aluno");
    }

    const classData = await database.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      throw new Error("Turma não encontrada");
    }

    const existingEnrollment = await database.classStudent.findFirst({
      where: {
        classId,
        studentId: student.id,
      },
    });

    if (existingEnrollment) {
      throw new Error("Aluno já está matriculado nesta turma");
    }

    const classStudent = await database.classStudent.create({
      data: {
        classId,
        studentId: student.id,
      },
      include: {
        class: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            registration: true,
            role: true,
          },
        },
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

  async enterByCode(accessCode: string, userId: number) {
    const classData = await database.class.findUnique({
      where: { accessCode },
    });

    if (!classData) {
      throw new Error("Turma não encontrada com este código de acesso");
    }

    const existingEnrollment = await database.classStudent.findFirst({
      where: {
        classId: classData.id,
        studentId: userId,
      },
    });

    if (existingEnrollment) {
      throw new Error("Aluno já está matriculado nesta turma");
    }

    const enrollment = await database.classStudent.create({
      data: {
        classId: classData.id,
        studentId: userId,
      },
      include: {
        class: true,
        student: true,
      },
    });

    return enrollment;
  }

  async getMyClasses(userId: number, userRole: string) {
    if (userRole === "teacher") {
      const classes = await database.class.findMany({
        where: {
          teacherId: userId,
        },
        include: {
          teacher: true,
          students: {
            include: {
              student: true,
            },
          },
          questionnaires: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
      });
      return classes;
    }

    const enrollments = await database.classStudent.findMany({
      where: {
        studentId: userId,
      },
      include: {
        class: {
          include: {
            teacher: true,
            students: {
              include: {
                student: true,
              },
            },
            questionnaires: true,
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
    });

    return enrollments.map((enrollment) => enrollment.class);
  }

  async getClassStudents(classId: number, teacherId: number) {
    const classData = await database.class.findUnique({
      where: { id: classId },
      include: {
        teacher: true,
      },
    });

    if (!classData) {
      throw new Error("Turma não encontrada");
    }

    if (classData.teacherId !== teacherId) {
      throw new Error(
        "Você não tem permissão para acessar os alunos desta turma",
      );
    }

    const enrollments = await database.classStudent.findMany({
      where: {
        classId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            registration: true,
            role: true,
          },
        },
      },
    });

    return enrollments.map((enrollment) => enrollment.student);
  }

  async getClassStudentsByCode(
    accessCode: string,
    userId: number,
    userRole: string,
  ) {
    const classData = await database.class.findUnique({
      where: { accessCode },
      include: {
        teacher: true,
      },
    });

    if (!classData) {
      throw new Error("Turma não encontrada com este código de acesso");
    }

    if (userRole === "teacher" && classData.teacherId !== userId) {
      throw new Error(
        "Você não tem permissão para acessar os alunos desta turma",
      );
    }

    if (userRole === "student") {
      const isEnrolled = await database.classStudent.findFirst({
        where: {
          classId: classData.id,
          studentId: userId,
        },
      });

      if (!isEnrolled) {
        throw new Error("Você não está matriculado nesta turma");
      }
    }

    const enrollments = await database.classStudent.findMany({
      where: {
        classId: classData.id,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            registration: true,
            role: true,
          },
        },
      },
    });

    return {
      class: {
        id: classData.id,
        name: classData.name,
        description: classData.description,
        accessCode: classData.accessCode,
      },
      students: enrollments.map((enrollment) => enrollment.student),
    };
  }
}
