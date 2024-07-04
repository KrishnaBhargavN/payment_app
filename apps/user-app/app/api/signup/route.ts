import { NextResponse } from "next/server";
import db from "@repo/db/client";

export const GET = async () => {
  //   try {
  //     const users = await db.user.findMany();
  //     console.log(users);
  //     return NextResponse.json(
  //       {
  //         message: users,
  //       },
  //       {
  //         status: 200,
  //       }
  //     );
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         message: e,
  //       },
  //       {
  //         status: 403,
  //       }
  //     );
  //   }

  try {
    console.log("Creating user");

    const res = await db.user.create({
      data: {
        name: "John Doe",
        number: "123455433",
        password: "123456",
        email: "asdasdsd@gmail.com",
      },
    });
    return NextResponse.json(
      {
        message: res,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: e,
      },
      {
        status: 403,
      }
    );
  }
};
