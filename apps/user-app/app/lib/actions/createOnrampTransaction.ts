"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios from "axios";
import jwt from "jsonwebtoken";

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  // Ideally the token should come from the banking provider (hdfc/axis)
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const token = (Math.random() * 1000).toString();
  try {
    const res = await prisma.onRampTransaction.create({
      data: {
        provider,
        status: "Processing",
        startTime: new Date(),
        token: token,
        userId: Number(session?.user?.id),
        amount: amount * 100,
      },
    });
    const bankToken = jwt.sign({ onRampId: res.id }, process.env.BANK_SECRET, {
      expiresIn: "1h",
    });
    const bankResponse = await axios.post("http://localhost:8081/verify", {
      bankToken,
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Error in transaction",
    };
  }

  return {
    message: "Done",
  };
}
