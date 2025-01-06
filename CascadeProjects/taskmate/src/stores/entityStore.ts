import { create } from 'zustand';
import { Client, Project, Sprint, Task } from '../types/entities';

interface EntityStore {
  clients: Client[];
  projects: Project[];
  sprints: Sprint[];
  tasks: Task[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addSprint: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const initialState = {
  clients: [
    {
      id: '1',
      name: 'Demo Client',
      company: 'Demo Company',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  projects: [
    {
      id: '1',
      name: 'Demo Project',
      description: 'A demo project',
      clientId: '1',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  sprints: [
    {
      id: '1',
      name: 'Sprint 1',
      projectId: '1',
      status: 'active' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  tasks: [
    {
      id: '1',
      title: 'Demo Task',
      description: 'A demo task',
      status: 'todo' as const,
      project: {
        id: '1',
        name: 'Demo Project',
        client: {
          id: '1',
          name: 'Demo Client',
        },
      },
      priority: 'medium' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export const useEntityStore = create<EntityStore>((set) => ({
  ...initialState,

  addClient: (client) =>
    set((state) => ({
      clients: [
        ...state.clients,
        {
          ...client,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  addProject: (project) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...project,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  addSprint: (sprint) =>
    set((state) => ({
      sprints: [
        ...state.sprints,
        {
          ...sprint,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
}));
