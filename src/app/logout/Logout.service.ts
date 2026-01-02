import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";

@injectable()
export class LogoutService {
  private blacklistedTokens: Set<string> = new Set();

  async logout(token: string) {
    try {
      const secret = process.env.SECRET!;

      jwt.verify(token, secret);

      this.blacklistedTokens.add(token);

      return { success: true, message: "Logout successful" };
    } catch (error) {
      return { success: false, message: "Invalid token" };
    }
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
