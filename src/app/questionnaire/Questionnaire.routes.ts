import express, { Request, Response } from "express";
import { authMiddleware, teacherOnly } from "../../middlewares/auth.middleware";
import { container } from "tsyringe";
import { QuestionnaireController } from "./Questionnaire.controller";

export const questionnaireRouter = express.Router();
const questionnaireController = container.resolve(QuestionnaireController);
questionnaireRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  questionnaireController.index(req, res);
});
questionnaireRouter.get(
  "/available",
  authMiddleware,
  (req: Request, res: Response) => {
    questionnaireController.getAvailable(req, res);
  },
);
questionnaireRouter.post(
  "/",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionnaireController.create(req, res);
  },
);
questionnaireRouter.get(
  "/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    questionnaireController.show(req, res);
  },
);

questionnaireRouter.put(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionnaireController.update(req, res);
  },
);
questionnaireRouter.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionnaireController.delete(req, res);
  },
);
questionnaireRouter.get(
  "/grades/:classId",
  authMiddleware,
  teacherOnly,
  (req, res) => questionnaireController.getQuestionnaireGrades(req, res),
);
