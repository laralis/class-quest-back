import { inject, injectable } from "tsyringe";
import { LoginService } from "./Login.service";
import { type Request, type Response } from "express";

@injectable()
export class LoginController {
  constructor(@inject(LoginService) private loginService: LoginService) {}

  async login(req: Request, res: Response) {
    const data = req.body;
    const response = await this.loginService.login(data.email, data.password);
    if (response) {
      res.send({ token: response.token });
    } else {
      res.status(400).send();
    }
  }
}
