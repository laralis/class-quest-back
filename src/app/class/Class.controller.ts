import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { classAddStudentByEmailSchema } from "./Class.validator";
import { ClassService } from "./Class.service";

@injectable()
export class ClassController {
  constructor(@inject(ClassService) private classService: ClassService) {}

  async index(req: Request, res: Response) {
    try {
      const response = await this.classService.index();
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const data = {
        name: req.body.name,
        description: req.body.description || null,
        teacherId: user.id,
      };

      const imageFile = req.file;
      const protocol = req.protocol;
      const host = req.get("host");

      const turma = await this.classService.create(
        data,
        imageFile,
        protocol,
        host,
      );
      return res.status(201).json(turma);
    } catch (error: any) {
      return res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async addAlunoByEmail(req: Request, res: Response) {
    const { classId, studentEmail } = req.body;
    const relacao = await this.classService.addAlunoByEmail(
      classId,
      studentEmail,
    );
    return res.status(201).json(relacao);
  }

  async addStudentByEmail(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (user.role !== "teacher") {
        return res
          .status(403)
          .json({ error: "Apenas professores podem adicionar alunos" });
      }

      const parse = classAddStudentByEmailSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten() });
      }

      const { classId, email } = parse.data;

      const classData = await this.classService.findById(classId);
      if (!classData) {
        return res.status(404).json({ error: "Turma não encontrada" });
      }

      if (classData.teacherId !== user.id) {
        return res.status(403).json({
          error: "Você não tem permissão para adicionar alunos nesta turma",
        });
      }

      const enrollment = await this.classService.addAlunoByEmail(
        classId,
        email,
      );
      return res.status(201).json(enrollment);
    } catch (error: any) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async list(req: Request, res: Response) {
    const classes = await this.classService.list();
    return res.json(classes);
  }

  async enter(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const { accessCode } = req.body;

      if (!accessCode) {
        return res
          .status(400)
          .json({ error: "Código de acesso é obrigatório" });
      }

      const entry = await this.classService.enterByCode(accessCode, user.id);
      return res.status(201).json(entry);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const response = await this.classService.update(req.body, id);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { accessCode } = req.query;

      if (!accessCode || typeof accessCode !== "string") {
        return res
          .status(400)
          .send({ error: "Código de acesso é obrigatório" });
      }

      const response = await this.classService.findByAccessCode(accessCode);

      if (!response) {
        return res.status(404).send({ error: "Turma não encontrada" });
      }

      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const response = await this.classService.delete(id);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getMyClasses(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const classes = await this.classService.getMyClasses(user.id, user.role);
      return res.json(classes);
    } catch (error: any) {
      return res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getClassStudents(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const classId = Number(req.params.id);

      if (isNaN(classId)) {
        return res.status(400).json({ error: "ID da turma inválido" });
      }

      const students = await this.classService.getClassStudents(
        classId,
        user.id,
      );
      return res.json(students);
    } catch (error: any) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getClassStudentsByCode(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const { accessCode } = req.query;

      if (!accessCode || typeof accessCode !== "string") {
        return res
          .status(400)
          .json({ error: "Código de acesso é obrigatório" });
      }

      const result = await this.classService.getClassStudentsByCode(
        accessCode,
        user.id,
        user.role,
      );
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
