"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePathAction(path: string) {
    try {
        revalidatePath(path);
        return { success: true };
    } catch (error) {
        console.error("Failed to revalidate path:", error);
        return { success: false, error: "Failed to revalidate path" };
    }
}
