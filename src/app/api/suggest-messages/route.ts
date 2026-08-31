import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST() {
  try {
    const prompt = `
Generate exactly 3 interesting and friendly anonymous messages.

Rules:
- Each message should be open-ended.
- Avoid personal, sensitive, political, or offensive topics.
- Messages should encourage the recipient to reply.
- Keep each message short.
- Return ONLY the 3 messages.
- Separate each message using ||.

Example:
What's a hobby you've recently started?||What is something you've always wanted to learn?||What's one small thing that makes your day better?
`;

    const { text } = await generateText({
      model: google("gemini-3.6-flash"),
      prompt,
    });

    return Response.json({
      messages: text.split("||").map((message) => message.trim()),
    });
  } catch (error) {
    console.error("Suggest message error:", error);

    return Response.json(
      { message: "Failed to generate messages" },
      { status: 500 },
    );
  }
}
