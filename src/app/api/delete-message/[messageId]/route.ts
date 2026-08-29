import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Authentication required.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const updatedMessage = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
    );
    console.log("updated message:", updatedMessage);
    if (updatedMessage.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 },
      );
    }
    return Response.json(
      { message: "Message deleted successfully.", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete message:", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred while deleting the message.",
      },
      { status: 500 },
    );
  }
}
