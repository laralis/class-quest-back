import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { ClassController } from "./Class.controller";
import { authMiddleware, teacherOnly } from "../../middlewares/auth.middleware";
import { upload } from "../../config/multer";

export const classRouter = express.Router();

const classController = container.resolve(ClassController);
classRouter.get(
  "/my-classes",
  authMiddleware,
  (req: Request, res: Response) => {
    classController.getMyClasses(req, res);
  },
);
classRouter.post(
  "/",
  authMiddleware,
  teacherOnly,
  upload.single("image"),
  (req: Request, res: Response) => {
    classController.create(req, res);
  },
);
classRouter.get("/", authMiddleware, (req: Request, res: Response) => {
  classController.index(req, res);
});
classRouter.get("/find", authMiddleware, (req: Request, res: Response) => {
  classController.show(req, res);
});

classRouter.get("/students", authMiddleware, (req: Request, res: Response) => {
  classController.getClassStudentsByCode(req, res);
});

classRouter.put(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    classController.update(req, res);
  },
);
classRouter.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    classController.delete(req, res);
  },
);

classRouter.post(
  "/student-mail",
  authMiddleware,
  teacherOnly,
  (req: Request, res: Response) => {
    classController.addAlunoByEmail(req, res);
  },
);

classRouter.post("/code", authMiddleware, (req: Request, res: Response) => {
  classController.enter(req, res);
});
