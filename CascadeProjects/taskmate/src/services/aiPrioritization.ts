import { Task, Project } from '../types/entities';
import { googleCalendarService } from './googleCalendar';
import { claudeApi } from './claudeApi';

interface TaskPrioritizationContext {
  dueDate: Date;
  projectPriority: number;
  clientPriority: number;
  dependencies: number;
  estimatedEffort: number;
  availableSlots: number;
}

export class AIPrioritizationService {
  async prioritizeTasks(tasks: Task[], projects: Project[]) {
    // Get available calendar slots for the next 5 days
    const availableSlots = await this.getAvailableSlots(5);
    
    // Create context for each task
    const taskContexts = await Promise.all(
      tasks.map(task => this.createTaskContext(task, projects, availableSlots))
    );

    // Use Claude to analyze and prioritize tasks
    const prompt = this.createPrioritizationPrompt(tasks, taskContexts);
    const response = await claudeApi.analyze(prompt);

    // Parse AI recommendations and update tasks
    return this.parseAIRecommendations(response, tasks, availableSlots);
  }

  private async getAvailableSlots(days: number) {
    const slots: Date[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const daySlots = await googleCalendarService.findAvailableSlots(date);
      slots.push(...daySlots);
    }

    return slots;
  }

  private async createTaskContext(
    task: Task,
    projects: Project[],
    availableSlots: Date[]
  ): Promise<TaskPrioritizationContext> {
    const project = projects.find(p => p.id === task.projectId);
    
    return {
      dueDate: new Date(task.dueDate),
      projectPriority: project?.priority || 0,
      clientPriority: project?.clientPriority || 0,
      dependencies: task.dependencies?.length || 0,
      estimatedEffort: task.estimatedMinutes || 30,
      availableSlots: this.countSuitableSlots(task, availableSlots),
    };
  }

  private countSuitableSlots(task: Task, availableSlots: Date[]) {
    const requiredSlots = Math.ceil((task.estimatedMinutes || 30) / 30);
    let count = 0;

    for (let i = 0; i < availableSlots.length - requiredSlots + 1; i++) {
      let consecutive = true;
      for (let j = 0; j < requiredSlots - 1; j++) {
        const current = availableSlots[i + j];
        const next = availableSlots[i + j + 1];
        if (!this.areConsecutiveSlots(current, next)) {
          consecutive = false;
          break;
        }
      }
      if (consecutive) count++;
    }

    return count;
  }

  private areConsecutiveSlots(slot1: Date, slot2: Date) {
    return slot2.getTime() - slot1.getTime() === 30 * 60000;
  }

  private createPrioritizationPrompt(
    tasks: Task[],
    contexts: TaskPrioritizationContext[]
  ) {
    return `
      Analyze and prioritize the following tasks based on their context:
      ${tasks.map((task, i) => `
        Task: ${task.title}
        Due Date: ${contexts[i].dueDate}
        Project Priority: ${contexts[i].projectPriority}
        Client Priority: ${contexts[i].clientPriority}
        Dependencies: ${contexts[i].dependencies}
        Estimated Effort: ${contexts[i].estimatedEffort} minutes
        Available Slots: ${contexts[i].availableSlots}
      `).join('\n')}

      Consider:
      1. Due dates and urgency
      2. Project and client priorities
      3. Dependencies between tasks
      4. Available time slots
      5. Estimated effort required

      For each task, provide:
      1. Recommended priority (high, medium, low)
      2. Suggested time slot (date and time)
      3. Brief explanation of the recommendation
    `;
  }

  private async parseAIRecommendations(
    aiResponse: string,
    tasks: Task[],
    availableSlots: Date[]
  ) {
    // Parse AI response and extract recommendations
    // This is a simplified version - you'd want to make this more robust
    const recommendations = aiResponse.split('\n\n').map(block => {
      const lines = block.split('\n');
      return {
        priority: lines.find(l => l.includes('priority'))?.split(':')[1].trim(),
        timeSlot: lines.find(l => l.includes('time slot'))?.split(':')[1].trim(),
        explanation: lines.find(l => l.includes('explanation'))?.split(':')[1].trim(),
      };
    });

    // Update tasks with AI recommendations
    return tasks.map((task, i) => {
      const rec = recommendations[i];
      if (!rec) return task;

      return {
        ...task,
        priority: rec.priority as 'high' | 'medium' | 'low',
        scheduledDate: this.findBestSlot(task, availableSlots),
        aiExplanation: rec.explanation,
      };
    });
  }

  private findBestSlot(task: Task, availableSlots: Date[]) {
    // Find the earliest slot that can accommodate the task
    const requiredSlots = Math.ceil((task.estimatedMinutes || 30) / 30);
    
    for (let i = 0; i < availableSlots.length - requiredSlots + 1; i++) {
      let consecutive = true;
      for (let j = 0; j < requiredSlots - 1; j++) {
        if (!this.areConsecutiveSlots(availableSlots[i + j], availableSlots[i + j + 1])) {
          consecutive = false;
          break;
        }
      }
      if (consecutive) return availableSlots[i];
    }

    return null;
  }
}

export const aiPrioritizationService = new AIPrioritizationService();
