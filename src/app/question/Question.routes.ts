import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { QuestionController } from "./Question.controller";
import { authMiddleware, teacherOnly } from "../../middlewares/auth.middleware";

export const questionRouter = express.Router();

const questionController = container.resolve(QuestionController);
questionRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  questionController.index(req, res);
});

questionRouter.post(
  "/",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionController.create(req, res);
  },
);

questionRouter.get("/:id", authMiddleware, (req: Request, res: Response) => {
  questionController.show(req, res);
});

questionRouter.put(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionController.update(req, res);
  },
);
questionRouter.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionController.delete(req, res);
  },
);

questionRouter.get(
  "/resume/:questionnaireId",
  authMiddleware,
  (req: Request, res: Response) => {
    questionController.showByQuestionnaire(req, res);
  },
);
