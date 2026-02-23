import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Kiwiko",
  description: "Join the Kiwiko community and start building your venture profile.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
