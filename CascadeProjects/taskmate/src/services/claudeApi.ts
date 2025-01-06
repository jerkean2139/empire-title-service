import { Message } from '../types/chat';

const CLAUDE_API_URL = import.meta.env.VITE_CLAUDE_API_URL;
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

interface ClaudeResponse {
  message: string;
  codeSnippets?: Array<{
    file: string;
    code: string;
    language: string;
  }>;
}

const systemPrompt = `You are Claude, an AI assistant integrated into Taskmate, a task management application. Your role is to help users with:

1. Task Management:
   - Breaking down large tasks into smaller, manageable subtasks
   - Estimating time for tasks
   - Suggesting task priorities
   - Recommending task organization strategies

2. Project Planning:
   - Creating project timelines
   - Identifying potential project risks
   - Suggesting project milestones
   - Helping with resource allocation

3. Sprint Planning:
   - Helping organize tasks into sprints
   - Suggesting sprint goals
   - Estimating sprint capacity
   - Identifying sprint dependencies

4. Time Management:
   - Providing Pomodoro technique guidance
   - Suggesting time management strategies
   - Helping with work-life balance
   - Identifying time-wasting activities

When responding:
1. Be concise and practical
2. Provide specific, actionable advice
3. Reference existing tasks and projects when relevant
4. Suggest concrete next steps
5. Use bullet points for clarity
6. Consider user context and preferences

You have access to:
- User's tasks, projects, and sprints
- Pomodoro timer data
- Client information
- Project deadlines

Format code suggestions using markdown code blocks with appropriate language tags.`;

export async function sendMessageToClaude(
  message: string,
  conversationContext: Message[],
  taskContext?: {
    currentTasks: any[];
    currentProjects: any[];
    currentSprints: any[];
    currentClients: any[];
  }
): Promise<ClaudeResponse> {
  if (!CLAUDE_API_URL || !CLAUDE_API_KEY) {
    throw new Error('Claude API configuration is missing. Please set VITE_CLAUDE_API_URL and VITE_CLAUDE_API_KEY in your .env file.');
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': CLAUDE_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...conversationContext.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          {
            role: 'user',
            content: message,
          },
        ],
        context: taskContext ? {
          tasks: taskContext.currentTasks,
          projects: taskContext.currentProjects,
          sprints: taskContext.currentSprints,
          clients: taskContext.currentClients,
        } : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API request failed: ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ''
        }`
      );
    }

    const data = await response.json();
    return {
      message: data.content[0].text,
      codeSnippets: extractCodeSnippets(data.content[0].text),
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

function extractCodeSnippets(content: string): Array<{ file: string; code: string; language: string }> {
  const snippets: Array<{ file: string; code: string; language: string }> = [];
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    snippets.push({
      file: `snippet.${match[1]}`,
      code: match[2].trim(),
      language: match[1],
    });
  }

  return snippets;
}
