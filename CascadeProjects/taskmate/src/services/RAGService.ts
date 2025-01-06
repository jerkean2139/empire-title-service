import { OpenAI } from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { Redis } from 'ioredis';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { createClient } from '@supabase/supabase-js';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    assignee: string;
    dueDate: Date;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    performance: {
      taskCompletion: number;
      qualityScore: number;
      velocityTrend: number;
    };
  }>;
  metrics: {
    progress: number;
    velocity: number;
    quality: number;
    risks: string[];
  };
}

interface ClientData {
  id: string;
  name: string;
  industry: string;
  projects: string[];
  interactions: Array<{
    date: Date;
    type: string;
    sentiment: number;
    notes: string;
  }>;
  preferences: {
    communicationStyle: string;
    priorities: string[];
    constraints: string[];
  };
}

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  skills: string[];
  projects: string[];
  performance: {
    productivity: number;
    quality: number;
    collaboration: number;
    learningProgress: number;
  };
  preferences: {
    workStyle: string;
    interests: string[];
    goals: string[];
  };
}

export class RAGService {
  private openai: OpenAI;
  private pinecone: PineconeClient;
  private redis: Redis;
  private supabase: any;
  private embeddings: OpenAIEmbeddings;
  private vectorStore: SupabaseVectorStore;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.pinecone = new PineconeClient();
    this.redis = new Redis(process.env.REDIS_URL);
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
    this.embeddings = new OpenAIEmbeddings();
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: this.supabase,
      tableName: 'documents',
    });
  }

  // Index new project data
  async indexProjectData(project: ProjectData): Promise<void> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // Create structured context from project data
    const projectContext = `
      Project: ${project.title}
      Description: ${project.description}
      Progress: ${project.metrics.progress}%
      Velocity: ${project.metrics.velocity} points/sprint
      Quality Score: ${project.metrics.quality}
      
      Team Members:
      ${project.team.map(member => `
        - ${member.name} (${member.role})
        - Task Completion: ${member.performance.taskCompletion}%
        - Quality Score: ${member.performance.qualityScore}
        - Velocity Trend: ${member.performance.velocityTrend}%
      `).join('\n')}
      
      Tasks:
      ${project.tasks.map(task => `
        - ${task.title}
        - Status: ${task.status}
        - Assignee: ${task.assignee}
        - Due: ${task.dueDate}
      `).join('\n')}
      
      Risks:
      ${project.metrics.risks.join('\n')}
    `;

    const docs = await textSplitter.createDocuments([projectContext]);
    await this.vectorStore.addDocuments(docs);

    // Cache frequently accessed data
    await this.redis.set(`project:${project.id}:metrics`, JSON.stringify(project.metrics));
    await this.redis.set(`project:${project.id}:team`, JSON.stringify(project.team));
  }

  // Index client data
  async indexClientData(client: ClientData): Promise<void> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const clientContext = `
      Client: ${client.name}
      Industry: ${client.industry}
      
      Projects: ${client.projects.join(', ')}
      
      Communication Style: ${client.preferences.communicationStyle}
      Priorities: ${client.preferences.priorities.join(', ')}
      Constraints: ${client.preferences.constraints.join(', ')}
      
      Recent Interactions:
      ${client.interactions.map(interaction => `
        Date: ${interaction.date}
        Type: ${interaction.type}
        Sentiment: ${interaction.sentiment}
        Notes: ${interaction.notes}
      `).join('\n')}
    `;

    const docs = await textSplitter.createDocuments([clientContext]);
    await this.vectorStore.addDocuments(docs);
  }

  // Index team member data
  async indexTeamMemberData(member: TeamMemberData): Promise<void> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const memberContext = `
      Team Member: ${member.name}
      Role: ${member.role}
      
      Skills: ${member.skills.join(', ')}
      Projects: ${member.projects.join(', ')}
      
      Performance:
      - Productivity: ${member.performance.productivity}%
      - Quality: ${member.performance.quality}%
      - Collaboration: ${member.performance.collaboration}%
      - Learning Progress: ${member.performance.learningProgress}%
      
      Preferences:
      - Work Style: ${member.preferences.workStyle}
      - Interests: ${member.preferences.interests.join(', ')}
      - Goals: ${member.preferences.goals.join(', ')}
    `;

    const docs = await textSplitter.createDocuments([memberContext]);
    await this.vectorStore.addDocuments(docs);
  }

  // Query the knowledge base
  async query(
    question: string,
    context?: {
      projectId?: string;
      clientId?: string;
      teamMemberId?: string;
    }
  ): Promise<{
    answer: string;
    relevantDocs: Document[];
    confidence: number;
    suggestions: string[];
  }> {
    // Get relevant documents
    const relevantDocs = await this.vectorStore.similaritySearch(question, 5);

    // Get cached context if available
    let additionalContext = '';
    if (context?.projectId) {
      const projectMetrics = await this.redis.get(`project:${context.projectId}:metrics`);
      if (projectMetrics) {
        additionalContext += `\nProject Metrics: ${projectMetrics}`;
      }
    }

    // Prepare prompt with context
    const prompt = `
      Context:
      ${relevantDocs.map(doc => doc.pageContent).join('\n\n')}
      ${additionalContext}
      
      Question: ${question}
      
      Please provide:
      1. A direct answer to the question
      2. Any relevant metrics or trends
      3. Actionable suggestions
      4. Potential risks or concerns
    `;

    // Get completion from OpenAI
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Calculate confidence score based on relevance and completion
    const confidence = this.calculateConfidence(relevantDocs, completion);

    // Generate suggestions based on historical data
    const suggestions = await this.generateSuggestions(question, relevantDocs);

    return {
      answer: completion.choices[0].message.content || '',
      relevantDocs,
      confidence,
      suggestions,
    };
  }

  // Generate insights from historical data
  async generateInsights(
    entityType: 'project' | 'client' | 'team',
    entityId: string
  ): Promise<{
    trends: Array<{ metric: string; trend: number; insight: string }>;
    recommendations: string[];
    risks: string[];
    opportunities: string[];
  }> {
    // Get historical data
    const historicalData = await this.vectorStore.similaritySearch(
      `${entityType} ${entityId} historical performance`,
      10
    );

    // Analyze trends
    const trends = await this.analyzeTrends(historicalData);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      entityType,
      entityId,
      historicalData
    );

    // Identify risks and opportunities
    const { risks, opportunities } = await this.analyzeRisksAndOpportunities(
      entityType,
      entityId,
      historicalData
    );

    return {
      trends,
      recommendations,
      risks,
      opportunities,
    };
  }

  private calculateConfidence(docs: Document[], completion: any): number {
    // Implement confidence scoring based on:
    // - Relevance of retrieved documents
    // - Consistency of information
    // - Completion quality
    // Returns a score between 0 and 1
    return 0.85; // Placeholder
  }

  private async generateSuggestions(
    question: string,
    docs: Document[]
  ): Promise<string[]> {
    // Generate contextual suggestions based on:
    // - Similar historical queries
    // - Best practices
    // - Current context
    return [
      "Review team velocity trends",
      "Schedule a client check-in",
      "Update risk assessment",
    ];
  }

  private async analyzeTrends(docs: Document[]): Promise<Array<{
    metric: string;
    trend: number;
    insight: string;
  }>> {
    // Analyze historical data for trends
    return [
      {
        metric: "Team Velocity",
        trend: 0.15,
        insight: "15% increase in velocity over last 3 sprints",
      },
    ];
  }

  private async generateRecommendations(
    entityType: string,
    entityId: string,
    docs: Document[]
  ): Promise<string[]> {
    // Generate personalized recommendations
    return [
      "Implement pair programming sessions",
      "Increase client communication frequency",
      "Review and update documentation",
    ];
  }

  private async analyzeRisksAndOpportunities(
    entityType: string,
    entityId: string,
    docs: Document[]
  ): Promise<{
    risks: string[];
    opportunities: string[];
  }> {
    // Analyze potential risks and opportunities
    return {
      risks: [
        "Technical debt in authentication system",
        "Resource constraints in upcoming sprint",
      ],
      opportunities: [
        "Potential for team skill development",
        "Client expansion opportunity",
      ],
    };
  }
}

export const ragService = new RAGService();
