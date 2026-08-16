import sendVerificationEmail from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Username, email, and password are required",
        },
        { status: 400 },
      );
    }

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already registered",
        },
        { status: 409 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const verifiedCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already registered",
          },
          { status: 409 },
        );
      }

      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifiedCode = verifyCode;
      existingUserByEmail.verifiedCodeExpiry = verifiedCodeExpiry;

      await existingUserByEmail.save();
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifiedCode: verifyCode,
        verifiedCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Verification email could not be sent",
        },
        { status: 502 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Registration successful. Please verify your email.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred during registration",
      },
      { status: 500 },
    );
  }
}
