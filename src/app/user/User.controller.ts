import { inject, injectable } from "tsyringe";
import { UserService } from "./User.service";
import { Request, Response } from "express";
import {
  userCreateSchema,
  userUpdateSchema,
} from "./validators/User.validator";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async index(req: Request, res: Response) {
    const response = await this.userService.index();

    res.send(response);
  }

  async create(req: Request, res: Response) {
    const result = userCreateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).send({ errors: result.error });
    }

    try {
      const response = await this.userService.create({
        ...result.data,
        registration: result.data.registration ?? null,
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
    const result = userUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).send({ errors: result.error });
    }

    const id = Number(req.params.id);

    const response = await this.userService.update(result.data, id);

    res.send(response);
  }
}
