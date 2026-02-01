import express from "express";
import { loginRouter } from "./login/Login.routes";
import { classRouter } from "./class/Class.routes";
import { alternativeRouter } from "./alternative/Alternative.routes";
import { logoutRouter } from "./logout/Logout.routes";
import { questionnaireRouter } from "./questionnaire/Questionnaire.routes";
import { resultsRouter } from "./results/Results.routes";
import { userRouter } from "./user/User.routes";
import { userAnswerRouter } from "./user-answer/UserAnswer.routes";
import { questionRouter } from "./question/Question.routes";

export const router = express.Router();

router.use("/login", loginRouter);
router.use("/class", classRouter);
router.use("/alternative", alternativeRouter);
router.use("/logout", logoutRouter);
router.use("/questionnaire", questionnaireRouter);
router.use("/question", questionRouter);
router.use("/results", resultsRouter);
router.use("/user", userRouter);
router.use("/user-answer", userAnswerRouter);
