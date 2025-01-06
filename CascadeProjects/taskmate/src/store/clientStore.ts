import { create } from 'zustand';
import { Client, ClientFormData } from '../types/client';
import { format } from 'date-fns';

type FilterOperator = 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn';

interface FilterCondition {
  field: keyof Client;
  operator: FilterOperator;
  value: any;
  secondValue?: any; // For 'between' operator
}

interface FilterGroup {
  conditions: FilterCondition[];
  matchType: 'AND' | 'OR';
}

interface ClientStore {
  clients: Client[];
  searchTerm: string;
  filterGroups: FilterGroup[];
  sortBy: 'name' | 'lastContact' | 'projectCount' | 'company';
  sortDirection: 'asc' | 'desc';
  selectedTags: string[];
  setSearchTerm: (term: string) => void;
  addFilterGroup: (group: FilterGroup) => void;
  removeFilterGroup: (index: number) => void;
  updateFilterGroup: (index: number, group: FilterGroup) => void;
  clearFilters: () => void;
  setSortBy: (field: 'name' | 'lastContact' | 'projectCount' | 'company') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setSelectedTags: (tags: string[]) => void;
  addClient: (data: ClientFormData) => void;
  updateClient: (id: string, data: Partial<ClientFormData>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  getFilteredClients: () => Client[];
  exportClients: (format: 'csv' | 'json') => string;
}

const evaluateCondition = (client: Client, condition: FilterCondition): boolean => {
  const { field, operator, value, secondValue } = condition;
  const clientValue = client[field];

  switch (operator) {
    case 'equals':
      return clientValue === value;
    case 'notEquals':
      return clientValue !== value;
    case 'contains':
      return String(clientValue).toLowerCase().includes(String(value).toLowerCase());
    case 'notContains':
      return !String(clientValue).toLowerCase().includes(String(value).toLowerCase());
    case 'greaterThan':
      return clientValue > value;
    case 'lessThan':
      return clientValue < value;
    case 'between':
      return clientValue >= value && clientValue <= (secondValue || value);
    case 'in':
      return Array.isArray(value) && value.includes(clientValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(clientValue);
    default:
      return false;
  }
};

const evaluateFilterGroup = (client: Client, group: FilterGroup): boolean => {
  const results = group.conditions.map(condition => evaluateCondition(client, condition));
  return group.matchType === 'AND'
    ? results.every(result => result)
    : results.some(result => result);
};

// Mock initial data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'Acme Inc',
    status: 'active',
    tags: ['VIP', 'Tech'],
    projectCount: 3,
    lastContact: new Date('2024-01-01'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    company: 'Tech Corp',
    status: 'active',
    tags: ['Enterprise', 'Finance'],
    projectCount: 5,
    lastContact: new Date('2024-01-03'),
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '555-555-5555',
    company: 'Startup Ltd',
    status: 'pending',
    tags: ['Startup', 'Tech'],
    projectCount: 1,
    lastContact: new Date('2023-12-28'),
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-28'),
  },
];

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: mockClients,
  searchTerm: '',
  filterGroups: [],
  sortBy: 'name',
  sortDirection: 'asc',
  selectedTags: [],
  
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  
  addFilterGroup: (group: FilterGroup) => 
    set(state => ({ filterGroups: [...state.filterGroups, group] })),
  
  removeFilterGroup: (index: number) =>
    set(state => ({
      filterGroups: state.filterGroups.filter((_, i) => i !== index)
    })),
  
  updateFilterGroup: (index: number, group: FilterGroup) =>
    set(state => ({
      filterGroups: state.filterGroups.map((g, i) => i === index ? group : g)
    })),
  
  clearFilters: () => set({ filterGroups: [], searchTerm: '', selectedTags: [] }),
  
  setSortBy: (field) => set({ sortBy: field }),
  setSortDirection: (direction) => set({ sortDirection: direction }),
  setSelectedTags: (tags: string[]) => set({ selectedTags: tags }),
  
  addClient: (data: ClientFormData) => {
    const newClient: Client = {
      id: Date.now().toString(),
      ...data,
      projectCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      clients: [...state.clients, newClient],
    }));
  },
  
  updateClient: (id: string, data: Partial<ClientFormData>) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id
          ? { ...client, ...data, updatedAt: new Date() }
          : client
      ),
    }));
  },
  
  deleteClient: (id: string) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },
  
  getClient: (id: string) => {
    return get().clients.find((client) => client.id === id);
  },

  getFilteredClients: () => {
    const state = get();
    let filtered = [...state.clients];

    // Apply search
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.company?.toLowerCase().includes(searchLower) ||
          client.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filter groups
    if (state.filterGroups.length > 0) {
      filtered = filtered.filter(client =>
        state.filterGroups.every(group => evaluateFilterGroup(client, group))
      );
    }

    // Apply tag filter
    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((client) =>
        state.selectedTags.some((tag) => client.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'lastContact':
          comparison = (a.lastContact?.getTime() || 0) - (b.lastContact?.getTime() || 0);
          break;
        case 'projectCount':
          comparison = a.projectCount - b.projectCount;
          break;
        case 'company':
          comparison = (a.company || '').localeCompare(b.company || '');
          break;
      }
      return state.sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  },

  exportClients: (format: 'csv' | 'json') => {
    const clients = get().getFilteredClients();
    
    if (format === 'json') {
      return JSON.stringify(clients, null, 2);
    }
    
    // CSV export
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Tags', 'Projects', 'Last Contact', 'Created At'];
    const rows = clients.map(client => [
      client.name,
      client.email,
      client.phone || '',
      client.company || '',
      client.status,
      client.tags.join(', '),
      client.projectCount.toString(),
      client.lastContact ? format(new Date(client.lastContact), 'yyyy-MM-dd') : '',
      format(new Date(client.createdAt), 'yyyy-MM-dd')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
  },
}));
