import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { UserController } from "./User.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const userRouter = express.Router();
const userController = container.resolve(UserController);
userRouter.post("/", (req: Request, res: Response) => {
  userController.create(req, res);
});

userRouter.get("/", (req: Request, res: Response) => {
  userController.index(req, res);
});

userRouter.get("/find", authMiddleware, (req: Request, res: Response) => {
  userController.findOne(req, res);
});
userRouter.put("/:id", authMiddleware, (req: Request, res: Response) => {
  userController.update(req, res);
});
