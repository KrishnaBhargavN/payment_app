import express, { Request, Response } from "express";
import prisma from "@repo/db/client";

const app = express();
app.use(express.json());
const port = 8080;

app.post("/bankWebhook", async (req: Request, res: Response) => {
  const paymentinfo = {
    token: req.body.token,
    amount: req.body.amount,
    userId: req.body.userId,
  };
  try {
    await prisma.$transaction([
      prisma.balance.updateMany({
        where: {
          userId: Number(paymentinfo.userId),
        },
        data: {
          amount: {
            increment: Number(paymentinfo.amount),
          },
        },
      }),
      prisma.onRampTransaction.updateMany({
        where: {
          token: paymentinfo.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    console.log("success");

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

app.post("/test", (req, res) => {
  console.log(req.body);

  res.json({
    message: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
