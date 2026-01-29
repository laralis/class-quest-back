import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { authMiddleware, teacherOnly } from "../middlewares/auth.middleware";
import { LoginController } from "./login/Login.controller";
import { LogoutController } from "./logout/Logout.controller";
import { UserController } from "./user/User.controller";
import { ClassController } from "./class/Class.controller";
import { AlternativeController } from "./alternative/Alternative.controller";
import { QuestionnaireController } from "./questionnaire/Questionnaire.controller";
import { QuestionController } from "./question/Question.controller";
import { UserAnswerController } from "./user-answer/UserAnswer.controller";
import { ResultsController } from "./results/Results.controller";
import { upload } from "../config/multer";

export const router = express.Router();

// Rotas públicas (sem autenticação)
const loginController = container.resolve(LoginController);
router.post("/login", (req: Request, res: Response) => {
  loginController.login(req, res);
});

const userController = container.resolve(UserController);
router.post("/user", (req: Request, res: Response) => {
  userController.create(req, res);
});

// Rotas autenticadas
const logoutController = container.resolve(LogoutController);
router.post("/logout", authMiddleware, (req: Request, res: Response) => {
  logoutController.logout(req, res);
});

router.get("/user", (req: Request, res: Response) => {
  userController.index(req, res);
});

router.get("/user/find", authMiddleware, (req: Request, res: Response) => {
  userController.findOne(req, res);
});
router.put("/user/:id", authMiddleware, (req: Request, res: Response) => {
  userController.update(req, res);
});

// Rotas de turma (teachers podem criar, todos autenticados podem visualizar)
const classController = container.resolve(ClassController);
router.get(
  "/class/my-classes",
  authMiddleware,
  (req: Request, res: Response) => {
    classController.getMyClasses(req, res);
  },
);
router.post(
  "/class",
  authMiddleware,
  upload.single("image"),
  (req: Request, res: Response) => {
    classController.create(req, res);
  },
);
router.get("/class", authMiddleware, (req: Request, res: Response) => {
  classController.index(req, res);
});
router.get("/class/find", authMiddleware, (req: Request, res: Response) => {
  classController.show(req, res);
});

router.get("/class/students", authMiddleware, (req: Request, res: Response) => {
  classController.getClassStudentsByCode(req, res);
});
router.put(
  "/class/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    classController.update(req, res);
  },
);
router.delete(
  "/class/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    classController.delete(req, res);
  },
);

router.post(
  "/class/student-mail",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    classController.addAlunoByEmail(req, res);
  },
);

router.post("/class/code", authMiddleware, (req: Request, res: Response) => {
  classController.enter(req, res);
});

// Rotas de questionário (apenas professores)
const questionnaireController = container.resolve(QuestionnaireController);
router.get("/questionnaire", authMiddleware, (req: Request, res: Response) => {
  questionnaireController.index(req, res);
});
router.get(
  "/questionnaire/available",
  authMiddleware,
  (req: Request, res: Response) => {
    questionnaireController.getAvailable(req, res);
  },
);
router.post(
  "/questionnaire",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionnaireController.create(req, res);
  },
);
router.get(
  "/questionnaire/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    questionnaireController.show(req, res);
  },
);
router.put(
  "/questionnaire/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionnaireController.update(req, res);
  },
);
router.delete(
  "/questionnaire/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionnaireController.delete(req, res);
  },
);
router.get(
  "/questionnaire/grades/:classId",
  authMiddleware,
  teacherOnly,
  (req, res) => questionnaireController.getQuestionnaireGrades(req, res),
);

const questionController = container.resolve(QuestionController);
router.get("/question", authMiddleware, (req: Request, res: Response) => {
  questionController.index(req, res);
});

router.post(
  "/question",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionController.create(req, res);
  },
);

router.get("/question/:id", authMiddleware, (req: Request, res: Response) => {
  questionController.show(req, res);
});

router.put(
  "/question/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionController.update(req, res);
  },
);
router.delete(
  "/question/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    questionController.delete(req, res);
  },
);

router.get(
  "/questions/questionnaire/:questionnaireId",
  authMiddleware,
  (req: Request, res: Response) => {
    questionController.showByQuestionnaire(req, res);
  },
);

const alternativeController = container.resolve(AlternativeController);
router.get("/alternative", authMiddleware, (req: Request, res: Response) => {
  alternativeController.index(req, res);
});

router.post(
  "/alternative",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    alternativeController.create(req, res);
  },
);

router.put(
  "/alternative/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    alternativeController.update(req, res);
  },
);

router.delete(
  "/alternative/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    alternativeController.delete(req, res);
  },
);

// Rotas de respostas (alunos podem responder, todos autenticados podem visualizar)
const userAnswerController = container.resolve(UserAnswerController);
router.get("/user-answer", authMiddleware, (req: Request, res: Response) => {
  userAnswerController.index(req, res);
});

router.post("/user-answer", authMiddleware, (req: Request, res: Response) => {
  userAnswerController.create(req, res);
});

router.get(
  "/user-answer/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.show(req, res);
  },
);
router.get(
  "/user-answer/student/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.showByStudent(req, res);
  },
);
router.put(
  "/user-answer/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.update(req, res);
  },
);
router.delete(
  "/user-answer/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.delete(req, res);
  },
);

// Rotas de resultados
const resultsController = container.resolve(ResultsController);
router.get("/results", authMiddleware, (req: Request, res: Response) => {
  resultsController.index(req, res);
});
router.post("/results", authMiddleware, (req: Request, res: Response) => {
  resultsController.create(req, res);
});

router.get(
  "/results/:classId/final-grade/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    userAnswerController.calculateClassGrade(req, res);
  },
);
router.get("/results/:id", authMiddleware, (req: Request, res: Response) => {
  resultsController.show(req, res);
});
router.get(
  "/results/student/:studentId",
  authMiddleware,
  (req: Request, res: Response) => {
    resultsController.showByStudent(req, res);
  },
);
router.put("/results/:id", authMiddleware, (req: Request, res: Response) => {
  resultsController.update(req, res);
});
router.delete("/results/:id", authMiddleware, (req: Request, res: Response) => {
  resultsController.delete(req, res);
});
