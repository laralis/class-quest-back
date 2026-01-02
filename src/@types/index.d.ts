import "express";
import { ZodSchema } from "zod";
import { UserPayload } from "../core/types";

declare module "express" {
  interface Request {
    user?: UserPayload;
    validate<T>(schema: ZodSchema<T>): {
      data: T;
      errors: any[];
    };
  }
}
