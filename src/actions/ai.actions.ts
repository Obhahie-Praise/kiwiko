"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSession } from "@/lib/dal";

import prisma from "@/lib/prisma";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export async function getKiwikoAgentHistoryAction(projectId: string) {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const messages = await prisma.aIChatMessage.findMany({
      where: { projectId, userId: session.user.id },
      orderBy: { createdAt: "asc" }
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("Error fetching AI history:", error);
    return { success: false, error: "Failed to fetch history" };
  }
}

export async function chatWithKiwikoAgentAction(
  projectId: string,
  message: string
) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    // 1. Fetch extensive project context
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        organization: true,
        metricSnapshots: { orderBy: { timestamp: "desc" }, take: 1 },
        updates: { orderBy: { createdAt: "desc" }, take: 3 },
      }
    });

    const recentEvents = await prisma.event.findMany({
      where: { projectId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const contextBlock = `
PROJECT CONTEXT:
Project Name: ${project?.name}
Description: ${project?.description || "N/A"}
Stage: ${project?.stage || "N/A"}
Organization: ${project?.organization?.name || "N/A"}
GitHub Commits (30d): ${project?.githubCommitCount30d || 0}
Recent Events Count: ${recentEvents.length}

USER INFO:
User Name: ${session.user.name}
User Email: ${session.user.email}
    `;

    const SYSTEM_INSTRUCTION = `You are Kiwiko Agent, a friendly and helpful AI assistant built into the Kiwiko platform. 
Kiwiko is a platform connecting early-stage startups with investors. It acts as a command center for startup growth, tracking metrics (like GitHub commits and funding), managing teams, and writing progress updates.
Your purpose is to help founders navigate the platform, draft updates, analyze metrics, and answer questions about startups and fundraising.

Here is the context of the project and user you are currently talking to:
${contextBlock}

Keep your answers very concise, practical, and encouraging. Use markdown for lists or bold text when helpful.`;

    // 2. Fetch history from DB
    const dbMessages = await prisma.aIChatMessage.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "asc" }
    });

    // Save the user's new message to DB
    await prisma.aIChatMessage.create({
      data: {
        projectId,
        userId,
        role: "user",
        content: message
      }
    });

    const cleanedHistory: { role: "user" | "model"; parts: [{ text: string }] }[] = [];
    
    for (const msg of dbMessages) {
      const gRole = msg.role === "model" ? "model" : "user";
      if (cleanedHistory.length === 0) {
         if (gRole === "user") cleanedHistory.push({ role: "user", parts: [{ text: msg.content }] });
      } else {
         if (cleanedHistory[cleanedHistory.length - 1].role !== gRole) {
           cleanedHistory.push({ role: gRole as "user" | "model", parts: [{ text: msg.content }] } as any);
         } else {
           cleanedHistory[cleanedHistory.length - 1].parts[0].text += `\n\n${msg.content}`;
         }
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        ...cleanedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [
          {
            functionDeclarations: [
              {
                name: "composeEmail",
                description: "Compose an email to someone on behalf of the user. Only use this when the user explicitly asks to draft or send an email.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    to: { type: Type.STRING, description: "The recipient's email address." },
                    subject: { type: Type.STRING, description: "The subject of the email." },
                    body: { type: Type.STRING, description: "The formatted body content of the email." }
                  },
                  required: ["to", "subject", "body"]
                }
              },
              {
                name: "composeUpdate",
                description: "Draft a new project update to share with the team and investors.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "A catchy title for the project update." },
                    details: { type: Type.STRING, description: "The full details of the progress update." }
                  },
                  required: ["title", "details"]
                }
              },
              {
                name: "createEvent",
                description: "Create a calendar event or meeting.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    startTime: { type: Type.STRING, description: "ISO date string" },
                    endTime: { type: Type.STRING, description: "ISO date string" }
                  },
                  required: ["title", "startTime", "endTime"]
                }
              }
            ]
          }
        ]
      }
    });

    // Check for tool calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolCall = response.functionCalls[0];
      const toolName = toolCall.name || "";
      const aiResponseText = `I have drafted the ${toolName.replace('compose', '').replace('create', '')} for you. Please review it in the window.`;
      
      await prisma.aIChatMessage.create({
        data: { projectId, userId, role: "model", content: aiResponseText }
      });

      return { 
        success: true, 
        text: aiResponseText,
        toolCall: {
          name: toolCall.name,
          args: toolCall.args
        }
      };
    }

    if (response.text) {
      await prisma.aIChatMessage.create({
        data: { projectId, userId, role: "model", content: response.text }
      });
      return { success: true, text: response.text };
    } else {
      return { success: false, error: "No response text generated." };
    }
  } catch (error) {
    console.error("[Kiwiko Agent Error]:", error);
    return { success: false, error: "Failed to communicate with Kiwiko Agent." };
  }
}
