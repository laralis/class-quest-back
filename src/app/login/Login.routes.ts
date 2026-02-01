import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { LoginController } from "./Login.controller";

const loginController = container.resolve(LoginController);
export const loginRouter = express.Router();

loginRouter.post("/", (req: Request, res: Response) => {
  loginController.login(req, res);
});
