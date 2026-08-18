import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const codeResult = verifySchema.safeParse({ code });

    if (!codeResult.success) {
      console.log(codeResult.error);
      return Response.json(
        {
          success: false,
          message: codeResult.error.format().code?._errors || [],
        },
        { status: 400 },
      );
    }

    const decodeUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodeUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const verificationCode = codeResult.data;

    const isVerifiedCode = user.verifiedCode === verificationCode.code;
    const isVerifiedCodeNotExpired =
      new Date(user.verifiedCodeExpiry) > new Date();

    if (!isVerifiedCode || !isVerifiedCodeNotExpired) {
      if (!isVerifiedCodeNotExpired) {
        return Response.json(
          {
            success: false,
            message: "Verification code has expired",
          },
          {
            status: 400,
          },
        );
      } else {
        return Response.json(
          {
            success: false,
            message: "Invalid verification code",
          },
          {
            status: 400,
          },
        );
      }
    }

    user.isVerified = true;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "User verified successfully",
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
