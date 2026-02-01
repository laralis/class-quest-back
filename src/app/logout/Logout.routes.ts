import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { container } from "tsyringe";
import { LogoutController } from "./Logout.controller";

export const logoutRouter = express.Router();

const logoutController = container.resolve(LogoutController);
logoutRouter.post("/", authMiddleware, (req: Request, res: Response) => {
  logoutController.logout(req, res);
});
