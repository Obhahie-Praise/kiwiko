"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type WaitlistResponse = {
  success: boolean;
  message: string;
  isDuplicate?: boolean;
};

export async function joinWaitlistAction(formData: FormData): Promise<WaitlistResponse> {
  const email = formData.get("email") as string;
  const source = formData.get("source") as string || "landing_page";

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: true, isDuplicate: true, message: "You're already on the waitlist!" };
    }

    await prisma.waitlist.create({
      data: {
        email,
        source,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Welcome! Your spot on the waitlist is secured." };
  } catch (error) {
    console.error("Waitlist error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}

