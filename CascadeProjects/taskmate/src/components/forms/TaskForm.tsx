import { useState, useEffect } from 'react';
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
  Typography,
  Slider,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Task } from '../../types/task';
import { Project } from '../../types/project';
import { Sprint } from '../../types/sprint';
import { addHours, format } from 'date-fns';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  projects: Project[];
  sprints: Sprint[];
  initialData?: Partial<Task>;
}

export function TaskForm({ open, onClose, onSubmit, projects, sprints, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>(initialData || {
    title: '',
    description: '',
    projectId: '',
    sprintId: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    estimatedHours: 1,
    assignedTo: '',
    tags: [],
  });

  const [availableSprints, setAvailableSprints] = useState<Sprint[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter sprints based on selected project
  useEffect(() => {
    if (formData.projectId) {
      setAvailableSprints(sprints.filter(sprint => sprint.projectId === formData.projectId));
    } else {
      setAvailableSprints([]);
    }
  }, [formData.projectId, sprints]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (formData.estimatedHours && (formData.estimatedHours < 0 || formData.estimatedHours > 100)) {
      newErrors.estimatedHours = 'Estimated hours must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData as Task);
    }
  };

  const handleChange = (field: string) => (value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear sprint if project changes
    if (field === 'projectId') {
      setFormData(prev => ({ ...prev, sprintId: '' }));
    }

    // Auto-set due date to 4 hours from now for new tasks
    if (field === 'status' && value === 'todo' && !formData.dueDate && !initialData) {
      setFormData(prev => ({ ...prev, dueDate: addHours(new Date(), 4) }));
    }
  };

  const statusOptions = ['todo', 'in-progress', 'review', 'done'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="title"
              label="Task Title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title')(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
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

            <FormControl error={!!errors.projectId} required>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.projectId || ''}
                onChange={(e) => handleChange('projectId')(e.target.value)}
                label="Project"
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl disabled={!formData.projectId}>
              <InputLabel>Sprint</InputLabel>
              <Select
                value={formData.sprintId || ''}
                onChange={(e) => handleChange('sprintId')(e.target.value)}
                label="Sprint"
              >
                {availableSprints.map((sprint) => (
                  <MenuItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </MenuItem>
                ))}
              </Select>
              {!formData.projectId && (
                <FormHelperText>Select a project first</FormHelperText>
              )}
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'todo'}
                  onChange={(e) => handleChange('status')(e.target.value)}
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Chip 
                        label={status}
                        size="small"
                        color={
                          status === 'done' ? 'success' :
                          status === 'in-progress' ? 'primary' :
                          status === 'review' ? 'warning' :
                          'default'
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
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
                        color={
                          priority === 'urgent' ? 'error' :
                          priority === 'high' ? 'warning' :
                          priority === 'medium' ? 'info' :
                          'default'
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <DateTimePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => handleChange('dueDate')(date)}
            />

            <Box>
              <Typography gutterBottom>
                Estimated Hours
              </Typography>
              <Slider
                value={formData.estimatedHours || 1}
                onChange={(_, value) => handleChange('estimatedHours')(value)}
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={0.5}
                max={8}
              />
            </Box>

            <TextField
              name="assignedTo"
              label="Assigned To"
              value={formData.assignedTo || ''}
              onChange={(e) => handleChange('assignedTo')(e.target.value)}
            />

            <TextField
              name="tags"
              label="Tags (comma-separated)"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleChange('tags')(e.target.value.split(',').map(tag => tag.trim()))}
              helperText="Enter tags separated by commas"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
