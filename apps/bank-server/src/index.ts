import express from "express";
import db from "@repo/db/client";
import axios from "axios";
import jwt from "jsonwebtoken";
require("dotenv").config();

const app = express();
app.use(express.json());
const port = 8081;

app.post("/verify", async (req, res) => {
  const { bankToken } = req.body;
  const { onRampId } = jwt.verify(bankToken, process.env.BANK_SECRET);

  try {
    const onRampTransaction = await db.onRampTransaction.findFirst({
      where: {
        id: onRampId,
      },
      select: {
        token: true,
        amount: true,
        userId: true,
      },
    });
    console.log("onRampTransaction : ", onRampTransaction);
    const res = await axios.post("http://localhost:8080/bankWebhook", {
      token: onRampTransaction.token,
      amount: onRampTransaction.amount,
      userId: onRampTransaction.userId,
    });
  } catch (error) {
    console.log(error);
    res.status(411).json({
      message: "Error in transaction",
    });
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
