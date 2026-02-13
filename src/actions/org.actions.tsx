"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "crypto";
import React from "react";

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function createOrganizationAction(formData: FormData): Promise<ActionResponse<{ orgId: string; invites: any[] }>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const niche = formData.get("niche") as string;
  const logoUrl = formData.get("logoUrl") as string || null;
  const bannerUrl = formData.get("bannerUrl") as string || null;
  const invitesJson = formData.get("invites") as string; 

  if (!name || !slug || !description || !niche) {
    return { success: false, error: "Name, slug, description, and niche are required" };
  }

  let inviteEmails: string[] = [];
  try {
    const members = JSON.parse(invitesJson);
    inviteEmails = Array.isArray(members) 
      ? members.map((m: any) => m.email).filter((e: string) => e && isValidEmail(e))
      : [];
  } catch (e) {
    console.error("Failed to parse invites:", e);
  }

  console.log("Creating organization with data:", { name, slug, userId });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Organization + Owner Membership in one go
      const org = await tx.organization.create({
        data: {
          name,
          slug,
          description,
          niche,
          logoUrl,
          bannerUrl,
          ownerId: userId,
          memberships: {
            create: {
              userId: userId,
              role: "OWNER",
            }
          }
        },
      });

      console.log("Organization created:", org.id);

      // 3. Create invite records
      const invites = await Promise.all(
        inviteEmails.map(async (email) => {
          const token = crypto.randomBytes(32).toString("hex");
          return tx.organizationInvite.create({
            data: {
              email,
              role: "MEMBER",
              orgId: org.id,
              invitedById: userId,
              token,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
          });
        })
      );

      return { org, invites };
    });

    revalidatePath("/organizations");
    return { success: true, data: { orgId: result.org.id, invites: result.invites } };
  } catch (error: any) {
    console.error("Failed to create organization:", error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        return { success: false, error: "Organization with this slug already exists" };
    }
    return { success: false, error: "Failed to create organization" };
  }
}
