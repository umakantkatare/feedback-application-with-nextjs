import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("check-username-route", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        {
          status: 400,
        },
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 409,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error checking username:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
