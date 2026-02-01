import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";
import { LogoutService } from "../app/logout/Logout.service";

interface TokenPayload {
  id: number;
  name: string;
  email: string;
  role?: "student" | "teacher";
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const logoutService = container.resolve(LogoutService);
    if (logoutService.isTokenBlacklisted(token)) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const secret = process.env.SECRET!;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export const teacherOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Acesso negado. Apenas professores" });
  }

  next();
};

export const studentOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Acesso negado. Apenas alunos" });
  }

  next();
};
