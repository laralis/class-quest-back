import { database } from "../../database";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";

@injectable()
export class LoginService {
  async login(email: string, password: string) {
    const user = await database.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const payload = {
        name: user.name,
        id: user.id,
        email: user.email,
      };

      const decodedPassword = await argon2.verify(user?.password, password);

      const secret = process.env.SECRET!;

      if (decodedPassword) {
        const token = jwt.sign(payload, secret, { expiresIn: "5m" });
        return { token };
      } else {
        return null;
      }
    }
  }
}
