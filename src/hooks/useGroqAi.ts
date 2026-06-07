import { useState } from "react";
import { getSwapAdvice, getSupportReply } from "../service/groq";
import type { Rate, SwapAdvisorResponse } from "../types";

// Chat message shape for support chat history

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Hook 1 — useSwapAdvisor
// Called on the Swap screen when user selects tokens

interface UseSwapAdvisorReturn {
  advice: SwapAdvisorResponse | null;
  loading: boolean;
  getAdvice: (
    fromAsset: string,
    toAsset: string,
    rates: Rate[],
  ) => Promise<void>;
}

export const useSwapAdvisor = (): UseSwapAdvisorReturn => {
  const [advice, setAdvice] = useState<SwapAdvisorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAdvice = async (
    fromAsset: string,
    toAsset: string,
    rates: Rate[],
  ) => {
    try {
      setLoading(true);
      setAdvice(null);

      const result = await getSwapAdvice(fromAsset, toAsset, rates);
      setAdvice(result);
    } catch (err) {
      console.warn("useSwapAdvisor: Groq request failed", err);

      // Fallback advice if Groq is unavailable
      setAdvice({
        recommendation: "neutral",
        message: "Unable to fetch advice right now. Proceed with caution.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { advice, loading, getAdvice };
};

// Hook 2 — useSupportChat
// Powers the support chat window with message history

interface UseSupportChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

export const useSupportChat = (): UseSupportChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Default greeting shown when support chat opens
    {
      role: "assistant",
      content:
        "Hello! I am the SwiftyEx support assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat immediately
    const userMessage: ChatMessage = { role: "user", content: message };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);

    try {
      setLoading(true);

      // Send full history for context-aware replies
      const reply = await getSupportReply(message, updatedHistory);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn("useSupportChat: Groq request failed", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Please contact our support team on Telegram.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reset chat back to the default greeting
  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I am the SwiftyEx support assistant. How can I help you today?",
      },
    ]);
  };

  return { messages, loading, sendMessage, clearChat };
};
