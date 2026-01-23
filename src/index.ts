import express from "express";
import "dotenv/config";
import "reflect-metadata";
import cors from "cors";
import path from "path";
import { router } from "./app/routes";
import { PrismaClient } from "@prisma/client";

const port = process.env.PORT || 3000;
const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(router);

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
