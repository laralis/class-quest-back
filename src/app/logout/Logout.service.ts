import { injectable } from "tsyringe";

@injectable()
export class LogoutService {
  private blacklistedTokens: Set<string> = new Set();

  async logout(token: string) {
    this.blacklistedTokens.add(token);
    return { success: true, message: "Logout realizado com sucesso" };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
