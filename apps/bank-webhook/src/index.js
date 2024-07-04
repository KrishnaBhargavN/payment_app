import express from "express";
import db from "@repo/db/client";

const app = express();
const port = 8080;

app.post("/bankWebhook", async (req, res) => {
  const paymentinfo = {
    token: req.body.token,
    amount: req.body.amount,
    userId: req.body.userId,
  };
  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentinfo.userId),
        },
        data: {
          amount: {
            increment: paymentinfo.amount,
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentinfo.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "captured",
    });
  } catch (error) {
    console.log(error);
    res.status(411).json({
      message: "Error in transaction",
    });
  }
});

app.listen(port);
