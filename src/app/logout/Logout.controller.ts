import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { LogoutService } from "./Logout.service";

@injectable()
export class LogoutController {
  constructor(
    @inject(LogoutService)
    private logoutService: LogoutService
  ) {}

  async logout(req: Request, res: Response) {
    try {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return res.status(401).json({ message: "Token not provided" });
      }

      const token = authorization.replace("Bearer ", "");

      const result = await this.logoutService.logout(token);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
