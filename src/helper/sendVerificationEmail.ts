import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../emails/VerificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export default async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Verification code from Feedback App.`,
      react: VerificationEmailTemplate({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification code send successfully!" };
  } catch (emailErr) {
    console.error("Error sending verification email", emailErr);
    return { success: false, message: "Failed to send verification code" };
  }
}
