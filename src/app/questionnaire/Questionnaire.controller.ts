import { inject, injectable } from "tsyringe";
import { QuestionnaireService } from "./Questionnaire.service";
import { Request, Response } from "express";

@injectable()
export class QuestionnaireController {
  constructor(
    @inject(QuestionnaireService)
    private questionnaireService: QuestionnaireService
  ) {}

  async index(req: Request, res: Response) {
    try {
      const response = await this.questionnaireService.index();
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAvailable(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (user.role !== "student") {
        return res
          .status(403)
          .json({ error: "Apenas alunos podem acessar esta rota" });
      }

      const response =
        await this.questionnaireService.getAvailableQuestionnaires(user.id);
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

      if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      // Pega o userId do token, não do body
      const response = await this.questionnaireService.create(
        req.body,
        user.id
      );
      res.status(201).send(response);
    } catch (error: any) {
      res.status(400).send({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const response = await this.questionnaireService.update(req.body, id);
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
      const response = await this.questionnaireService.findById(id);

      if (!response) {
        return res.status(404).send({ error: "Questionnaire not found" });
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
      const response = await this.questionnaireService.delete(id);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
