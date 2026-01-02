import { User } from "@prisma/client";

export type UserPayload = Omit<User, "password"> & {
  iat: number;
  exp: number;
};
