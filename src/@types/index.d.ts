import "express";
import { ZodSchema } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        role?: "student" | "teacher";
        iat: number;
        exp: number;
      };
    }
  }
}