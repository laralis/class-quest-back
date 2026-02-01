import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { authMiddleware, teacherOnly } from "../../middlewares/auth.middleware";
import { AlternativeController } from "./Alternative.controller";

export const alternativeRouter = express.Router();

const alternativeController = container.resolve(AlternativeController);
alternativeRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  alternativeController.index(req, res);
});

alternativeRouter.post(
  "/",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    alternativeController.create(req, res);
  },
);

alternativeRouter.put(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    alternativeController.update(req, res);
  },
);

alternativeRouter.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    alternativeController.delete(req, res);
  },
);
