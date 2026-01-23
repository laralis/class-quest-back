import "express";
import { ZodSchema } from "zod";

// declare module "express" {
//   interface Request {
//     user?: {
//       id: number;
//       name: string;
//       email: string;
//       role?: "student" | "teacher";
//       iat: number;
//       exp: number;
//     };
//     validate<T>(schema: ZodSchema<T>): {
//       data: T;
//       errors: any[];
//     };
//   }
// }
