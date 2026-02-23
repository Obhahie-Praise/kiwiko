import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Kiwiko",
  description: "Access the global network of high-momentum builders and investors on Kiwiko.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
