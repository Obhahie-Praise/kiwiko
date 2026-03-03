import { Realtime } from "ably";
import { ChatClient } from "@ably/chat";

/**
 * Note for USER: 
 * For this to work, you must add NEXT_PUBLIC_ABLY_API_KEY to your .env file.
 * In a production environment, it is highly recommended to use an authCallback
 * to protect your API key from being exposed on the client side.
 */
const ablyKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;

let ablyClient: Realtime | null = null;
let chatClient: ChatClient | null = null;

export const getAblyChat = () => {
    if (!ablyKey) {
        console.warn("Ably API key not found. Chat will not be real-time.");
        return null;
    }

    if (!ablyClient) {
        ablyClient = new Realtime({ key: ablyKey, clientId: "user-" + Math.random().toString(36).substring(7) }); // Temporary client ID
        chatClient = new ChatClient(ablyClient);
    }

    return chatClient;
};
