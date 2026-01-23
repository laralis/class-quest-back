import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { LogoutService } from "./Logout.service";

@injectable()
export class LogoutController {
  constructor(@inject(LogoutService) private logoutService: LogoutService) {}

  async logout(req: Request, res: Response) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authorization.replace("Bearer ", "");
    const result = await this.logoutService.logout(token);

    return res.status(200).json(result);
  }
}
