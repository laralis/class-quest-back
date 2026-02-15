import { inject, injectable } from "tsyringe";
import { UserAnswerService } from "./UserAnswer.service";
import { Request, Response } from "express";

@injectable()
export class UserAnswerController {
  constructor(
    @inject(UserAnswerService) private userAnswerService: UserAnswerService,
  ) {}

  async index(req: Request, res: Response) {
    try {
      const response = await this.userAnswerService.index();
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
      const response = await this.userAnswerService.create(req.body);
      res.status(201).send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const response = await this.userAnswerService.update(req.body, id);
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
      const response = await this.userAnswerService.findById(id);

      if (!response) {
        return res.status(404).send({ error: "User answer not found" });
      }

      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async showByStudent(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.studentId);
      const response = await this.userAnswerService.findByStudent(studentId);
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
      const response = await this.userAnswerService.delete(id);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
