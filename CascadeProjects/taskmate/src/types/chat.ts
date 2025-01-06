export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'claude';
  timestamp: Date;
  codeSnippets?: Array<{
    file: string;
    code: string;
    language: string;
  }>;
}

export interface ChatState {
  messages: Message[];
  isSearching: boolean;
  error: string | null;
}

export interface ChatStore extends ChatState {
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setIsSearching: (isSearching: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}
