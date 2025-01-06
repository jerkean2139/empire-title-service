export interface PomodoroSessionData {
  date: Date;
  completed: boolean;
  notes: string;
  duration: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  project: {
    id: string;
    name: string;
    client?: {
      id: string;
      name: string;
    };
    sprint?: {
      id: string;
      name: string;
    };
  };
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
