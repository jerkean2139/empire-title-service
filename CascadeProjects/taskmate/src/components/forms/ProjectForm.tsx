import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Project } from '../../types/project';
import { Client } from '../../types/client';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => void;
  clients: Client[];
  initialData?: Partial<Project>;
}

export function ProjectForm({ open, onClose, onSubmit, clients, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(initialData || {
    name: '',
    description: '',
    clientId: '',
    startDate: null,
    endDate: null,
    status: 'planning',
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData as Project);
    }
  };

  const handleChange = (field: string) => (value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const statusOptions = ['planning', 'in-progress', 'on-hold', 'completed'];
  const priorityOptions = ['low', 'medium', 'high'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="name"
              label="Project Name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name')(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              autoFocus
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description')(e.target.value)}
              multiline
              rows={3}
            />

            <FormControl error={!!errors.clientId} required>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.clientId || ''}
                onChange={(e) => handleChange('clientId')(e.target.value)}
                label="Client"
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleChange('startDate')(date)}
                sx={{ flex: 1 }}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => handleChange('endDate')(date)}
                sx={{ flex: 1 }}
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate
                  }
                }}
              />
            </Box>

            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'planning'}
                onChange={(e) => handleChange('status')(e.target.value)}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Chip 
                      label={status} 
                      size="small"
                      color={status === 'completed' ? 'success' : status === 'in-progress' ? 'primary' : 'default'}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority || 'medium'}
                onChange={(e) => handleChange('priority')(e.target.value)}
                label="Priority"
              >
                {priorityOptions.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <Chip 
                      label={priority}
                      size="small"
                      color={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'default'}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Save Changes' : 'Add Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
