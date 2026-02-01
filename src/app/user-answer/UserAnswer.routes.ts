import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { container } from "tsyringe";
import { UserAnswerController } from "./UserAnswer.controller";

export const userAnswerRouter = express.Router();
const userAnswerController = container.resolve(UserAnswerController);

userAnswerRouter.get(
  "/results/:classId/final-grade/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.calculateClassGrade(req, res);
  },
);
userAnswerRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  userAnswerController.index(req, res);
});

userAnswerRouter.post("/", authMiddleware, (req: Request, res: Response) => {
  userAnswerController.create(req, res);
});

userAnswerRouter.get("/:id", authMiddleware, (req: Request, res: Response) => {
  userAnswerController.show(req, res);
});
userAnswerRouter.get(
  "/student/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.showByStudent(req, res);
  },
);
userAnswerRouter.put("/:id", authMiddleware, (req: Request, res: Response) => {
  userAnswerController.update(req, res);
});

userAnswerRouter.delete(
  "/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.delete(req, res);
  },
);
