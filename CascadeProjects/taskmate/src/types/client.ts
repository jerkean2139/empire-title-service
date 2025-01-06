export type ClientLifecycleStage = 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
export type ClientPriority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ClientStatus = 'active' | 'inactive' | 'lead' | 'archived';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

export interface Client {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  size: string;
  website: string;
  description: string;
  status: ClientStatus;
  priority: ClientPriority;
  contacts: Contact[];
  projects: Project[];
  communications: Communication[];
  documents: Document[];
  customFields: Record<string, any>;
  activeProjects: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  completionPercentage: number;
  tasks: ProjectTask[];
  teamMembers: string[];
  documents: Document[];
  customFields: Record<string, any>;
  companyId: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  attachments: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  attachments: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'meeting' | 'call' | 'note';
  subject: string;
  content: string;
  date: Date;
  companyId: string;
  followUpDate?: Date;
  reminder?: Date;
}

export interface DeadlineItem {
  id: string;
  title: string;
  type: 'project' | 'sprint' | 'task';
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'due_soon' | 'overdue';
  deadline: Date;
  project: {
    id: string;
    name: string;
  };
  assignedBy?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'reminder';
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  attendees?: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface ClientFormData {
  companyName: string;
  industry: string;
  size: string;
  website: string;
  description: string;
  status: ClientStatus;
  priority: ClientPriority;
  contacts: Contact[];
  customFields: Record<string, any>;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  revenue?: number;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  lifecycleStage: ClientLifecycleStage;
  priority: ClientPriority;
  categoryId?: string;
  customFields: Record<string, any>;
  engagementScore: number;
  totalRevenue: number;
  lastEngagement?: Date;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  isPrimaryContact: boolean;
  portalAccess: boolean;
  lastLogin?: Date;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
    timezone: string;
  };
}

export interface Automation {
  id: string;
  name: string;
  type: 'reminder' | 'task' | 'email' | 'notification';
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    config: Record<string, any>;
  };
  action: {
    type: string;
    config: Record<string, any>;
  };
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  lastUsed?: Date;
  useCount: number;
}

export interface Report {
  id: string;
  name: string;
  type: 'company' | 'project' | 'communication' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated?: Date;
  nextGeneration?: Date;
  recipients: string[];
  template: {
    sections: ReportSection[];
    styling?: Record<string, any>;
  };
  filters?: Record<string, any>;
}

export interface ReportSection {
  type: 'table' | 'chart' | 'summary' | 'details';
  title: string;
  data: any;
  options?: Record<string, any>;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  value: any;
  options?: string[];
  required?: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'in_progress' | 'blocked' | 'pending';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date | string;
  estimatedPomodoros: number;
  actualPomodoros?: number;
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
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  assignedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  pomodoroSessions?: {
    date: Date;
    completed: boolean;
    notes: string;
    duration: number;
  }[];
}
