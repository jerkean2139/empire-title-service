import { OpenAI } from 'openai';
import { SentimentAnalyzer } from 'natural';
import { PineconeClient } from '@pinecone-database/pinecone';
import { Redis } from 'ioredis';
import { createClient } from '@supabase/supabase-js';
import * as tf from '@tensorflow/tfjs';
import { format, subDays, differenceInMinutes } from 'date-fns';

interface PomodoroSession {
  id: string;
  userId: string;
  taskId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: 'work' | 'shortBreak' | 'longBreak';
  completed: boolean;
  interruptions: number;
  focusScore: number;
  taskProgress: number;
}

interface TaskPrediction {
  taskId: string;
  estimatedDuration: number;
  confidenceScore: number;
  riskFactors: string[];
  recommendedPomodoros: number;
}

interface UserProductivity {
  dailyFocusTime: number;
  completedPomodoros: number;
  successRate: number;
  averageFocusScore: number;
  streakDays: number;
  bestTimeOfDay: string;
  distractionPatterns: {
    timeRanges: string[];
    commonSources: string[];
  };
  improvements: string[];
}

interface TeamEfficiency {
  velocityTrend: number[];
  taskCompletionRate: number;
  collaborationScore: number;
  skillDistribution: Record<string, number>;
  bottlenecks: string[];
  recommendations: string[];
}

interface ClientSentiment {
  overall: number;
  trends: {
    satisfaction: number;
    communication: number;
    delivery: number;
  };
  keyTopics: string[];
  riskAreas: string[];
  opportunities: string[];
}

export class AIAnalyticsService {
  private openai: OpenAI;
  private pinecone: PineconeClient;
  private redis: Redis;
  private supabase: any;
  private model: tf.LayersModel | null = null;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.pinecone = new PineconeClient();
    this.redis = new Redis(process.env.REDIS_URL);
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
    this.initializeModel();
  }

  private async initializeModel() {
    // Load pre-trained model for productivity prediction
    this.model = await tf.loadLayersModel('path/to/productivity/model');
  }

  // Pomodoro Analytics
  async analyzePomodoroEfficiency(
    userId: string,
    dateRange: [Date, Date]
  ): Promise<UserProductivity> {
    const sessions = await this.supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('userId', userId)
      .gte('startTime', dateRange[0])
      .lte('endTime', dateRange[1]);

    const completedSessions = sessions.filter(s => s.completed);
    const focusScores = completedSessions.map(s => s.focusScore);

    // Analyze time patterns
    const timeAnalysis = this.analyzeProductiveTimePatterns(completedSessions);
    const distractions = this.analyzeDistractionPatterns(sessions);

    // Calculate improvements using GPT-4
    const improvements = await this.generateProductivityInsights(
      sessions,
      timeAnalysis,
      distractions
    );

    return {
      dailyFocusTime: this.calculateDailyFocusTime(completedSessions),
      completedPomodoros: completedSessions.length,
      successRate: completedSessions.length / sessions.length,
      averageFocusScore: this.average(focusScores),
      streakDays: this.calculateStreakDays(sessions),
      bestTimeOfDay: timeAnalysis.bestTime,
      distractionPatterns: distractions,
      improvements,
    };
  }

  // Sentiment Analysis
  async analyzeClientSentiment(
    clientId: string,
    dateRange: [Date, Date]
  ): Promise<ClientSentiment> {
    const interactions = await this.supabase
      .from('client_interactions')
      .select('*')
      .eq('clientId', clientId)
      .gte('date', dateRange[0])
      .lte('date', dateRange[1]);

    const sentiments = await Promise.all(
      interactions.map(async interaction => {
        const sentiment = await this.openai.chat.completions.create({
          model: "gpt-4-1106-preview",
          messages: [
            {
              role: "system",
              content: "Analyze the sentiment of this client interaction. Consider tone, content, and context."
            },
            {
              role: "user",
              content: interaction.content
            }
          ],
          temperature: 0.3,
        });

        return {
          score: this.parseSentimentScore(sentiment.choices[0].message.content),
          topics: this.extractKeyTopics(interaction.content),
        };
      })
    );

    return {
      overall: this.average(sentiments.map(s => s.score)),
      trends: this.calculateSentimentTrends(sentiments),
      keyTopics: this.aggregateTopics(sentiments),
      riskAreas: await this.identifyRiskAreas(sentiments, interactions),
      opportunities: await this.identifyOpportunities(sentiments, interactions),
    };
  }

  // Predictive Analytics
  async predictTaskCompletion(taskId: string): Promise<TaskPrediction> {
    const task = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    const similarTasks = await this.findSimilarTasks(task);
    const userPerformance = await this.getUserPerformanceMetrics(task.assigneeId);

    // Use TensorFlow.js for prediction
    const prediction = this.model!.predict(tf.tensor([
      this.prepareTaskFeatures(task, similarTasks, userPerformance)
    ])) as tf.Tensor;

    const [estimatedDuration, confidence] = await prediction.array();
    const riskFactors = await this.analyzeRiskFactors(task, similarTasks);

    return {
      taskId,
      estimatedDuration,
      confidenceScore: confidence,
      riskFactors,
      recommendedPomodoros: Math.ceil(estimatedDuration / 25), // 25 minutes per pomodoro
    };
  }

  // Team Analytics
  async analyzeTeamEfficiency(
    teamId: string,
    dateRange: [Date, Date]
  ): Promise<TeamEfficiency> {
    const teamData = await this.supabase
      .from('team_performance')
      .select('*')
      .eq('teamId', teamId)
      .gte('date', dateRange[0])
      .lte('date', dateRange[1]);

    const velocityData = this.calculateVelocityTrend(teamData);
    const skillMatrix = await this.analyzeTeamSkills(teamId);
    const bottlenecks = await this.identifyBottlenecks(teamData);

    return {
      velocityTrend: velocityData,
      taskCompletionRate: this.calculateCompletionRate(teamData),
      collaborationScore: await this.calculateCollaborationScore(teamId),
      skillDistribution: skillMatrix,
      bottlenecks,
      recommendations: await this.generateTeamRecommendations(
        teamData,
        skillMatrix,
        bottlenecks
      ),
    };
  }

  // Natural Language Processing
  async processNaturalLanguageTask(
    description: string
  ): Promise<{
    parsedTask: any;
    suggestions: string[];
    relatedTasks: string[];
  }> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "Parse this task description and extract key information: title, type, priority, estimated effort, required skills, and dependencies."
        },
        {
          role: "user",
          content: description
        }
      ],
      temperature: 0.3,
    });

    const parsedTask = JSON.parse(completion.choices[0].message.content);
    const suggestions = await this.generateTaskSuggestions(parsedTask);
    const relatedTasks = await this.findRelatedTasks(parsedTask);

    return {
      parsedTask,
      suggestions,
      relatedTasks,
    };
  }

  // Private helper methods
  private async analyzeProductiveTimePatterns(
    sessions: PomodoroSession[]
  ): Promise<{
    bestTime: string;
    patterns: Record<string, number>;
  }> {
    const hourlyScores: Record<string, number[]> = {};

    sessions.forEach(session => {
      const hour = format(new Date(session.startTime), 'HH');
      if (!hourlyScores[hour]) hourlyScores[hour] = [];
      hourlyScores[hour].push(session.focusScore);
    });

    const averageScores = Object.entries(hourlyScores).map(([hour, scores]) => ({
      hour,
      score: this.average(scores),
    }));

    const bestTime = averageScores.reduce((a, b) => 
      a.score > b.score ? a : b
    ).hour;

    return {
      bestTime,
      patterns: Object.fromEntries(
        averageScores.map(({ hour, score }) => [hour, score])
      ),
    };
  }

  private analyzeDistractionPatterns(
    sessions: PomodoroSession[]
  ): {
    timeRanges: string[];
    commonSources: string[];
  } {
    const interruptedSessions = sessions.filter(s => s.interruptions > 0);
    const timeRanges = this.identifyCommonInterruptionTimes(interruptedSessions);
    const commonSources = this.analyzeInterruptionSources(interruptedSessions);

    return {
      timeRanges,
      commonSources,
    };
  }

  private async generateProductivityInsights(
    sessions: PomodoroSession[],
    timeAnalysis: any,
    distractions: any
  ): Promise<string[]> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "Analyze this productivity data and provide specific, actionable insights for improvement."
        },
        {
          role: "user",
          content: JSON.stringify({
            sessions,
            timeAnalysis,
            distractions,
          })
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  private calculateDailyFocusTime(sessions: PomodoroSession[]): number {
    return sessions.reduce((total, session) => {
      const duration = differenceInMinutes(
        new Date(session.endTime),
        new Date(session.startTime)
      );
      return total + duration;
    }, 0);
  }

  private calculateStreakDays(sessions: PomodoroSession[]): number {
    const dailySessions = new Set(
      sessions.map(s => format(new Date(s.startTime), 'yyyy-MM-dd'))
    );
    
    let streak = 0;
    let currentDate = new Date();

    while (dailySessions.has(format(currentDate, 'yyyy-MM-dd'))) {
      streak++;
      currentDate = subDays(currentDate, 1);
    }

    return streak;
  }

  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private async findSimilarTasks(task: any): Promise<any[]> {
    const embedding = await this.getTaskEmbedding(task);
    return this.pinecone.query({ vector: embedding, topK: 5 });
  }

  private async getTaskEmbedding(task: any): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${task.title} ${task.description}`,
    });
    return response.data[0].embedding;
  }

  private prepareTaskFeatures(
    task: any,
    similarTasks: any[],
    userPerformance: any
  ): number[] {
    // Convert task properties into numerical features
    return [
      task.complexity,
      task.priority,
      similarTasks.length,
      userPerformance.averageVelocity,
      userPerformance.taskSuccessRate,
      // Add more relevant features
    ];
  }

  private async analyzeRiskFactors(
    task: any,
    similarTasks: any[]
  ): Promise<string[]> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "Analyze this task and similar historical tasks to identify potential risk factors."
        },
        {
          role: "user",
          content: JSON.stringify({ task, similarTasks })
        }
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  private async calculateCollaborationScore(teamId: string): Promise<number> {
    const interactions = await this.supabase
      .from('team_interactions')
      .select('*')
      .eq('teamId', teamId);

    // Analyze collaboration patterns and calculate score
    return 0.85; // Placeholder
  }

  private async generateTeamRecommendations(
    teamData: any,
    skillMatrix: any,
    bottlenecks: string[]
  ): Promise<string[]> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "Generate specific recommendations for improving team performance based on this data."
        },
        {
          role: "user",
          content: JSON.stringify({ teamData, skillMatrix, bottlenecks })
        }
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}

export const aiAnalytics = new AIAnalyticsService();
