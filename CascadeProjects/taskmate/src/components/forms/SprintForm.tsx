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
  Typography,
  LinearProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Sprint } from '../../types/sprint';
import { Project } from '../../types/project';
import { addWeeks, format } from 'date-fns';

interface SprintFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (sprint: Sprint) => void;
  projects: Project[];
  initialData?: Partial<Sprint>;
}

export function SprintForm({ open, onClose, onSubmit, projects, initialData }: SprintFormProps) {
  const [formData, setFormData] = useState<Partial<Sprint>>(initialData || {
    name: '',
    goal: '',
    projectId: '',
    startDate: null,
    endDate: null,
    status: 'planning',
    capacity: 0,
    progress: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Sprint name is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.capacity && (formData.capacity < 0 || formData.capacity > 100)) {
      newErrors.capacity = 'Capacity must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData as Sprint);
    }
  };

  const handleChange = (field: string) => (value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-set end date to 2 weeks after start date
    if (field === 'startDate' && value && !formData.endDate) {
      setFormData(prev => ({ ...prev, endDate: addWeeks(value, 2) }));
    }
  };

  const statusOptions = ['planning', 'active', 'completed', 'cancelled'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Sprint' : 'Add New Sprint'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="name"
              label="Sprint Name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name')(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              autoFocus
            />

            <TextField
              name="goal"
              label="Sprint Goal"
              value={formData.goal || ''}
              onChange={(e) => handleChange('goal')(e.target.value)}
              multiline
              rows={2}
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleChange('startDate')(date)}
                sx={{ flex: 1 }}
                slotProps={{
                  textField: {
                    error: !!errors.startDate,
                    helperText: errors.startDate
                  }
                }}
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
                      color={
                        status === 'completed' ? 'success' :
                        status === 'active' ? 'primary' :
                        status === 'cancelled' ? 'error' :
                        'default'
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="capacity"
              label="Sprint Capacity (Story Points)"
              type="number"
              value={formData.capacity || ''}
              onChange={(e) => handleChange('capacity')(Number(e.target.value))}
              error={!!errors.capacity}
              helperText={errors.capacity}
              inputProps={{ min: 0, max: 100 }}
            />

            {initialData && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Sprint Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={formData.progress || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block', mt: 0.5 }}>
                  {formData.progress || 0}% Complete
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Save Changes' : 'Add Sprint'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
