import { resend } from "@/lib/resend";
import { TeamInviteEmail } from "@/components/emails/TeamInviteEmail";
import { render } from "@react-email/render";
import React from "react";

export interface SendTeamInviteParams {
  email: string;
  orgName: string;
  inviterName: string;
  inviteLink: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  projectName?: string;
}

export async function sendTeamInviteEmail(params: SendTeamInviteParams) {
  const { email, orgName, inviterName, inviteLink, logoUrl, bannerUrl, projectName } = params;

  try {
    const html = await render(
        React.createElement(TeamInviteEmail, {
            orgName,
            inviterName,
            role: "MEMBER",
            inviteLink,
            logoUrl,
            bannerUrl,
            projectName
          })
    );

    const data = await resend.emails.send({
      from: "Kiwiko <notifications@kiwiko.xyz>",
      to: email,
      subject: projectName 
        ? `You've been invited to work on ${projectName} on Kiwiko`
        : `You've been invited to join ${orgName} on Kiwiko`,
      html: html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
