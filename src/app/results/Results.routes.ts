import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { ResultsController } from "./Results.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const resultsRouter = express.Router();

const resultsController = container.resolve(ResultsController);
resultsRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  resultsController.index(req, res);
});
resultsRouter.post("/", authMiddleware, (req: Request, res: Response) => {
  resultsController.create(req, res);
});

resultsRouter.get("/:id", authMiddleware, (req: Request, res: Response) => {
  resultsController.show(req, res);
});
resultsRouter.get(
  "/student/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    resultsController.showByStudent(req, res);
  },
);
resultsRouter.put("/:id", authMiddleware, (req: Request, res: Response) => {
  resultsController.update(req, res);
});
resultsRouter.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  resultsController.delete(req, res);
});

resultsRouter.get(
  "/:classId/final-grade/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    resultsController.calculateStudentGrade(req, res);
  },
);

resultsRouter.get(
  "/:classId/all-students-grades",
  authMiddleware,
  (req: Request, res: Response) => {
    resultsController.calculateAllStudentsGrades(req, res);
  },
);
