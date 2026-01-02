import express from "express";
import "dotenv/config";
import "reflect-metadata";
import { router } from "./app/routes";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(router);
const prisma = new PrismaClient();

app.use((req, res, next) => {
  // eslint-disable-next-line
  //@ts-ignore
  req.validate = function <T extends object>(schema: ZodSchema) {
    try {
      const data = schema.parse(req.body);

      return { data: data as T, errors: null };
    } catch (error: any) {
      return { data: null, errors: error.errors };
    }
  };

  next();
});

async function main() {
  const hashedPassword = await argon2.hash("lara123");

  await prisma.user.deleteMany({
    where: {
      email: "lara@mail.com",
    },
  });

  await prisma.user.create({
    data: {
      name: "Larissa",
      email: "lara@mail.com",
      password: hashedPassword,
      role: "teacher",
      registration: "123",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

app.listen(port, () => {
  console.log("O servidor esta rodando na porta ", port);
});
