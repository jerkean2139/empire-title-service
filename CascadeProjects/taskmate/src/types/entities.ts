export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
  tags?: string[];
  projectCount?: number;
  lastContact?: Date;
}

export interface Project extends BaseEntity {
  name: string;
  description: string;
  clientId: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  completionPercentage: number;
  teamMembers: string[];
  documents: string[];
  customFields: Record<string, any>;
}

export interface Sprint extends BaseEntity {
  name: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  goals: string[];
  completionPercentage: number;
}

export interface Task extends BaseEntity {
  title: string;
  description: string;
  projectId: string;
  sprintId?: string;
  assignedTo?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedDate?: Date;
  tags?: string[];
  attachments?: string[];
  comments: { userId: string; content: string; createdAt: Date }[];
}
