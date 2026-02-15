import { sendEmail } from "@/lib/resend";
import { TeamInviteEmail } from "@/components/emails/TeamInviteEmail";
import * as React from "react";

export interface SendTeamInviteParams {
  email: string;
  orgName?: string;
  inviterName: string;
  inviteLink: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  projectName?: string;
}

export async function sendTeamInviteEmail(params: SendTeamInviteParams) {
  const { email, orgName, inviterName, inviteLink, logoUrl, bannerUrl, projectName } = params;

  return sendEmail({
    to: email,
    subject: projectName 
      ? `You've been invited to work on ${projectName} on Kiwiko`
      : `You've been invited to join ${orgName} on Kiwiko`,
    react: React.createElement(TeamInviteEmail, {
      orgName,
      inviterName,
      role: "MEMBER",
      inviteLink,
      logoUrl,
      bannerUrl,
      projectName
    }),
  });
}
