"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { sendProjectEmailAction } from "@/actions/mail.actions";

interface MailFormProps {
  projectId: string;
}

export default function MailForm({ projectId }: MailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const senderName = formData.get("senderName") as string;
    const senderEmail = formData.get("senderEmail") as string;
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;

    const result = await sendProjectEmailAction(
      projectId,
      senderName,
      senderEmail,
      subject,
      content
    );

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "Failed to send message.");
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center bg-zinc-50 rounded-2xl border border-zinc-100">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
        <h3 className="text-lg font-bold text-zinc-900 mb-2">Message Sent Successfully!</h3>
        <p className="text-sm text-zinc-500 max-w-sm">
          The project's founders and admins have received your message and will get back to you soon.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-semibold hover:bg-zinc-800 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-900" htmlFor="senderName">
            Your Name
          </label>
          <input
            type="text"
            id="senderName"
            name="senderName"
            required
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-900" htmlFor="senderEmail">
            Your Email
          </label>
          <input
            type="email"
            id="senderEmail"
            name="senderEmail"
            required
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900" htmlFor="subject">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition"
          placeholder="Investment Inquiry..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900" htmlFor="content">
          Message
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={6}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition resize-none"
          placeholder="How can we help you?"
        ></textarea>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
        </button>
      </div>
    </form>
  );
}
