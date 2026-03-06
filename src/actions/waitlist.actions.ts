"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export type WaitlistResponse = {
  success: boolean;
  message: string;
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

    if (existing && existing.emailVerified) {
      return { success: true, message: "You're already on the waitlist! We'll be in touch." };
    }

    const token = crypto.randomBytes(16).toString("hex"); // 32 chars
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (existing) {
       await prisma.waitlist.update({
        where: { email },
        data: {
          verificationToken: token,
          verificationExpiresAt: expiresAt,
          source: source !== "landing_page" ? source : existing.source,
        }
      });
    } else {
      await prisma.waitlist.create({
        data: {
          email,
          source,
          verificationToken: token,
          verificationExpiresAt: expiresAt,
        },
      });
    }

    // Send verification email
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email - Kiwiko Waitlist",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827; margin-bottom: 16px;">Welcome to the Kiwiko Waitlist!</h2>
          <p style="color: #4b5563; line-height: 1.5;">Thank you for your interest in Kiwiko. Please click the button below to verify your email address and confirm your spot on our waitlist.</p>
          <div style="margin: 32px 0;">
            <a href="https://kiwiko.vercel.app/api/verify?token=${token}" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
               Verify My Email
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Failed to send verification email. Please try again." };
    }

    revalidatePath("/");
    return { success: true, message: "Welcome! Please check your email to verify your spot." };
  } catch (error) {
    console.error("Waitlist error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}

