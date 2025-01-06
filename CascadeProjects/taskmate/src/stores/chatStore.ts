import { create } from 'zustand';
import { ChatStore } from '../types/chat';

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isSearching: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  setIsSearching: (isSearching) => set({ isSearching }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [], error: null }),
}));
