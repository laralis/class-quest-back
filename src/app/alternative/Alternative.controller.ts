import { inject, injectable } from "tsyringe";
import { AlternativeService } from "./Alternative.service";
import { Request, Response } from "express";
import {
  alternativeCreateSchema,
  alternativeUpdateSchema,
} from "./Alternative.validator";

@injectable()
export class AlternativeController {
  constructor(
    @inject(AlternativeService) private alternativeService: AlternativeService,
  ) {}

  async index(req: Request, res: Response) {
    try {
      const response = await this.alternativeService.index();
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async create(req: Request, res: Response) {
    const result = alternativeCreateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).send({
        error: "Erro de validação",
        message: "Os dados fornecidos não atendem aos critérios mínimos",
        details: result.error.format(),
      });
    }

    try {
      const response = await this.alternativeService.create({
        ...result.data,
        correct: result.data.correct ?? false,
      });
      res.status(201).send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async update(req: Request, res: Response) {
    const result = alternativeUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).send({
        error: "Erro de validação",
        message: "Os dados fornecidos não atendem aos critérios mínimos",
        details: result.error.format(),
      });
    }

    try {
      const id = Number(req.params.id);
      const response = await this.alternativeService.update(result.data, id);
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
      const response = await this.alternativeService.findById(id);

      if (!response) {
        return res.status(404).send({ error: "Alternative not found" });
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
      const response = await this.alternativeService.delete(id);
      res.send(response);
    } catch (error: any) {
      res.status(500).send({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
