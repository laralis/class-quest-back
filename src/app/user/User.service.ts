import type { User } from "@prisma/client";
import { database } from "../../database/index";
import argon2 from "argon2";
import { injectable } from "tsyringe";

@injectable()
export class UserService {
  async index() {
    const data = await database.user.findMany();

    return data;
  }
  async findOne(id: number) {
    const data = await database.user.findUnique({
      where: { id },
    });
    return data;
  }

 

  async create(data: Omit<User, "id">) {
    const password = await argon2.hash(data.password);

    const newUser = await database.user.create({
      data: {
        ...data,
        password,
      },
    });

    return newUser;
  }

  async update(data: Partial<Omit<User, "id" | "password">>, id: number) {
    const { password, ...safeData } = data as any;

    let updateData = { ...safeData };

    if (password) {
      const hashedPassword = await argon2.hash(password);
      updateData.password = hashedPassword;
    }

    const updatedUser = await database.user.update({
      data: updateData,
      where: { id },
    });

    return updatedUser;
  }
}
