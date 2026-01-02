import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { LoginController } from "./login/Login.controller";
import { LogoutController } from "./logout/Logout.controller";
import { UserController } from "./user/User.controller";
import { ClassController } from "./class/Class.controller";
import { AlternativeController } from "./alternative/Alternative.controller";
import { QuestionnaireController } from "./questionnaire/Questionnaire.controller";
import { QuestionController } from "./question/Question.controller";
import { UserAnswerController } from "./user-answer/UserAnswer.controller";
import { ResultsController } from "./results/Results.controller";

export const router = express.Router();

const loginController = container.resolve(LoginController);
router.post("/login", (req: Request, res: Response) => {
  loginController.login(req, res);
});

const logoutController = container.resolve(LogoutController);
router.post("/logout", (req: Request, res: Response) => {
  logoutController.logout(req, res);
});

const userController = container.resolve(UserController);
router.post("/user", (req: Request, res: Response) => {
  userController.create(req, res);
});
router.get("/user", (req: Request, res: Response) => {
  userController.index(req, res);
});
router.put("/user/:id", (req: Request, res: Response) => {
  userController.update(req, res);
});

const classController = container.resolve(ClassController);
router.post("/class", (req: Request, res: Response) => {
  classController.create(req, res);
});
router.get("/class", (req: Request, res: Response) => {
  classController.index(req, res);
});
router.get("/class/:id", (req: Request, res: Response) => {
  classController.show(req, res);
});
router.put("/class/:id", (req: Request, res: Response) => {
  classController.update(req, res);
});
router.delete("/class/:id", (req: Request, res: Response) => {
  classController.delete(req, res);
});
router.post("/class/student", (req: Request, res: Response) => {
  classController.addStudent(req, res);
});
router.get("/class", (req: Request, res: Response) => {
  classController.list(req, res);
});
router.post("/class/code", (req: Request, res: Response) => {
  classController.enter(req, res);
});

const alternativeController = container.resolve(AlternativeController);
router.get("/alternative", (req: Request, res: Response) => {
  alternativeController.index(req, res);
});
router.post("/alternative", (req: Request, res: Response) => {
  alternativeController.create(req, res);
});
router.put("/alternative/:id", (req: Request, res: Response) => {
  alternativeController.update(req, res);
});
router.delete("/alternative/:id", (req: Request, res: Response) => {
  alternativeController.delete(req, res);
});

const questionnaireController = container.resolve(QuestionnaireController);
router.get("/questionnaire", (req: Request, res: Response) => {
  questionnaireController.index(req, res);
});
router.post("/questionnaire", (req: Request, res: Response) => {
  questionnaireController.create(req, res);
});
router.get("/questionnaire/:id", (req: Request, res: Response) => {
  questionnaireController.show(req, res);
});
router.put("/questionnaire/:id", (req: Request, res: Response) => {
  questionnaireController.update(req, res);
});
router.delete("/questionnaire/:id", (req: Request, res: Response) => {
  questionnaireController.delete(req, res);
});

const questionController = container.resolve(QuestionController);
router.get("/question", (req: Request, res: Response) => {
  questionController.index(req, res);
});
router.post("/question", (req: Request, res: Response) => {
  questionController.create(req, res);
});
router.get("/question/:id", (req: Request, res: Response) => {
  questionController.show(req, res);
});
router.put("/question/:id", (req: Request, res: Response) => {
  questionController.update(req, res);
});
router.delete("/question/:id", (req: Request, res: Response) => {
  questionController.delete(req, res);
});

const userAnswerController = container.resolve(UserAnswerController);
router.get("/user-answer", (req: Request, res: Response) => {
  userAnswerController.index(req, res);
});
router.post("/user-answer", (req: Request, res: Response) => {
  userAnswerController.create(req, res);
});
router.get("/user-answer/:id", (req: Request, res: Response) => {
  userAnswerController.show(req, res);
});
router.get("/user-answer/student/:studentId", (req: Request, res: Response) => {
  userAnswerController.showByStudent(req, res);
});
router.put("/user-answer/:id", (req: Request, res: Response) => {
  userAnswerController.update(req, res);
});
router.delete("/user-answer/:id", (req: Request, res: Response) => {
  userAnswerController.delete(req, res);
});

const resultsController = container.resolve(ResultsController);
router.get("/results", (req: Request, res: Response) => {
  resultsController.index(req, res);
});
router.post("/results", (req: Request, res: Response) => {
  resultsController.create(req, res);
});
router.get("/results/:id", (req: Request, res: Response) => {
  resultsController.show(req, res);
});
router.get("/results/student/:studentId", (req: Request, res: Response) => {
  resultsController.showByStudent(req, res);
});
router.put("/results/:id", (req: Request, res: Response) => {
  resultsController.update(req, res);
});
router.delete("/results/:id", (req: Request, res: Response) => {
  resultsController.delete(req, res);
});
