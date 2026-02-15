import { Resend } from 'resend';
import * as React from 'react';

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set in environment variables.");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
  replyTo?: string;
}

/**
 * Unified email sending helper
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = "Kiwiko <notifications@kiwiko.xyz>",
  replyTo,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Resend Unexpected Error]:", err);
    return { success: false, error: err };
  }
}
