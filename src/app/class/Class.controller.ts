import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  classAddStudentSchema,
  classEnterSchema,
} from "../user/validators/Class.validator";
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
    const data = req.body;

    const turma = await this.classService.create(data);
    return res.status(201).json(turma);
  }

  async addStudent(req: Request, res: Response) {
    const parse = classAddStudentSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.flatten() });
    }

    const { classId, studentId } = parse.data;
    const relacao = await this.classService.addAluno(classId, studentId);
    return res.status(201).json(relacao);
  }

  async list(req: Request, res: Response) {
    const classes = await this.classService.list();
    return res.json(classes);
  }

  async enter(req: Request, res: Response) {
    const parse = classEnterSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.flatten() });
    }

    const { accessCode, studentId } = parse.data;

    try {
      const entry = await this.classService.enterByCode(accessCode, studentId);
      return res.status(201).json(entry);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
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
      const id = Number(req.params.id);
      const response = await this.classService.findById(id);

      if (!response) {
        return res.status(404).send({ error: "Class not found" });
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
}
