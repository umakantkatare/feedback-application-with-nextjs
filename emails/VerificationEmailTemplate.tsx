import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailTemplateProps {
  username: string;
  otp: string;
}

export function VerificationEmailTemplate({
  username,
  otp,
}: VerificationEmailTemplateProps) {
  const year = new Date().getFullYear();

  return (
    <Html>
      <Head />

      <Preview>Your verification code is {otp}</Preview>

      <Tailwind>
        <Body className="bg-zinc-950 py-10 font-sans">
          <Container className="mx-auto max-w-125 rounded-2xl border border-solid border-zinc-800 bg-zinc-900 px-8 py-10 shadow-2xl">
            <Section className="text-center">
              <Text className="m-0 text-2xl font-bold text-white">
                Feedback App
              </Text>

              <Text className="mt-2 text-xs uppercase tracking-[3px] text-zinc-500">
                Account Verification
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Heading className="m-0 text-3xl font-bold text-white">
                Verify Your Email
              </Heading>

              <Text className="mt-3 text-sm leading-6 text-zinc-400">
                Please verify your email address to continue using your account.
              </Text>
            </Section>

            <Section className="mt-8">
              <Text className="text-base text-zinc-200">
                Hi <span className="font-semibold text-white">{username}</span>,
              </Text>

              <Text className="text-sm leading-6 text-zinc-400">
                Thanks for signing up! Use the verification code below to verify
                your email address.
              </Text>
            </Section>

            <Section className="my-8 rounded-xl border border-solid border-zinc-700 bg-zinc-800 p-6 text-center">
              <Text className="m-0 text-xs font-medium uppercase tracking-[3px] text-zinc-400">
                Verification Code
              </Text>

              <Text className="m-0 mt-4 text-4xl font-bold tracking-[8px] text-blue-400">
                {otp}
              </Text>
            </Section>

            <Text className="text-center text-sm leading-6 text-zinc-400">
              This verification code will expire in{" "}
              <span className="font-semibold text-zinc-200">10 minutes</span>.
            </Text>

            <Section className="mt-6 rounded-lg border border-solid border-blue-900 bg-blue-950 p-4">
              <Text className="m-0 text-sm leading-5 text-blue-300">
                If you didn't request this verification code, you can safely
                ignore this email.
              </Text>
            </Section>

            <Section className="mt-8 border-t border-solid border-zinc-800 pt-5 text-center">
              <Text className="m-0 text-xs text-zinc-500">
                © {year} Feedback App. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerificationEmailTemplate;
