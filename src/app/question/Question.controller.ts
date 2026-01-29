import { inject, injectable } from "tsyringe";
import { QuestionService } from "./Question.service";
import { Request, Response } from "express";

@injectable()
export class QuestionController {
  constructor(
    @inject(QuestionService) private questionService: QuestionService,
  ) {}

  async index(req: Request, res: Response) {
    try {
      const response = await this.questionService.index();
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
      const response = await this.questionService.create(req.body);
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
      const response = await this.questionService.update(req.body, id);
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
      const response = await this.questionService.findById(id);

      if (!response) {
        return res.status(404).send({ error: "Question not found" });
      }

      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async showByQuestionnaire(req: Request, res: Response) {
    try {
      const questionnaireId = Number(req.params.questionnaireId);
      const response =
        await this.questionService.findByQuestionnaire(questionnaireId);
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
      const response = await this.questionService.delete(id);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
