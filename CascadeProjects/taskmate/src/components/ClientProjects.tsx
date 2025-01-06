import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
  LinearProgress,
  Tooltip,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Project, ProjectTask, ProjectStatus } from '../types/client';

interface Props {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onEditProject: (id: string, project: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onAddTask: (projectId: string, task: Omit<ProjectTask, 'id'>) => void;
  onEditTask: (projectId: string, taskId: string, task: Partial<ProjectTask>) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
}

const statusColors: Record<ProjectStatus, 'success' | 'warning' | 'error' | 'info'> = {
  completed: 'success',
  in_progress: 'warning',
  on_hold: 'error',
  planned: 'info',
};

const taskStatusColors = {
  completed: 'success',
  in_progress: 'warning',
  todo: 'error',
};

export default function ClientProjects({
  projects,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: Props) {
  const [open, setOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'planned' as ProjectStatus,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    budget: '',
    completionPercentage: 0,
  });

  const [taskForm, setTaskForm] = useState({
    name: '',
    status: 'todo' as ProjectTask['status'],
    dueDate: '',
  });

  const handleOpenProject = (project?: Project) => {
    if (project) {
      setProjectForm({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: format(new Date(project.startDate), 'yyyy-MM-dd'),
        endDate: project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '',
        budget: project.budget?.toString() || '',
        completionPercentage: project.completionPercentage,
      });
      setEditingProjectId(project.id);
    } else {
      setProjectForm({
        name: '',
        description: '',
        status: 'planned',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        budget: '',
        completionPercentage: 0,
      });
      setEditingProjectId(null);
    }
    setOpen(true);
  };

  const handleOpenTask = (projectId: string, task?: ProjectTask) => {
    setSelectedProjectId(projectId);
    if (task) {
      setTaskForm({
        name: task.name,
        status: task.status,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      });
      setEditingTaskId(task.id);
    } else {
      setTaskForm({
        name: '',
        status: 'todo',
        dueDate: '',
      });
      setEditingTaskId(null);
    }
    setTaskDialogOpen(true);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      name: projectForm.name,
      description: projectForm.description,
      status: projectForm.status,
      startDate: new Date(projectForm.startDate),
      endDate: projectForm.endDate ? new Date(projectForm.endDate) : undefined,
      budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined,
      completionPercentage: projectForm.completionPercentage,
      tasks: [],
    };

    if (editingProjectId) {
      onEditProject(editingProjectId, projectData);
    } else {
      onAddProject(projectData);
    }
    setOpen(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    const taskData = {
      name: taskForm.name,
      status: taskForm.status,
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
    };

    if (editingTaskId) {
      onEditTask(selectedProjectId, editingTaskId, taskData);
    } else {
      onAddTask(selectedProjectId, taskData);
    }
    setTaskDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Projects</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenProject()}
            >
              Add Project
            </Button>
          </Box>

          <List>
            {projects.map((project) => (
              <React.Fragment key={project.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1">{project.name}</Typography>
                        <Chip
                          label={project.status.replace('_', ' ')}
                          size="small"
                          color={statusColors[project.status]}
                        />
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {project.description}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon fontSize="small" />
                            {format(new Date(project.startDate), 'MMM d, yyyy')}
                            {project.endDate && ` - ${format(new Date(project.endDate), 'MMM d, yyyy')}`}
                          </Typography>
                          {project.budget && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <MoneyIcon fontSize="small" />
                              ${project.budget.toLocaleString()}
                            </Typography>
                          )}
                        </Stack>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                            Progress: {project.completionPercentage}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={project.completionPercentage}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Add Task">
                      <IconButton onClick={() => handleOpenTask(project.id)}>
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenProject(project)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => onDeleteProject(project.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={expandedProject === project.id ? 'Hide Tasks' : 'Show Tasks'}>
                      <IconButton onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}>
                        {expandedProject === project.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItem>

                <Collapse in={expandedProject === project.id}>
                  <List sx={{ pl: 4 }}>
                    {project.tasks.map((task) => (
                      <ListItem key={task.id}>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body1">{task.name}</Typography>
                              <Chip
                                label={task.status}
                                size="small"
                                color={taskStatusColors[task.status]}
                              />
                            </Stack>
                          }
                          secondary={
                            task.dueDate && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ScheduleIcon fontSize="small" />
                                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                              </Typography>
                            )
                          }
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenTask(project.id, task)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => onDeleteTask(project.id, task.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Project Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleProjectSubmit}>
          <DialogTitle>
            {editingProjectId ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                required
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={projectForm.status}
                  label="Status"
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })}
                >
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={projectForm.startDate}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={projectForm.endDate}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Budget"
                type="number"
                value={projectForm.budget}
                onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                InputProps={{ startAdornment: <MoneyIcon /> }}
              />

              <TextField
                fullWidth
                label="Completion Percentage"
                type="number"
                value={projectForm.completionPercentage}
                onChange={(e) => setProjectForm({ ...projectForm, completionPercentage: parseInt(e.target.value) || 0 })}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProjectId ? 'Save Changes' : 'Add Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleTaskSubmit}>
          <DialogTitle>
            {editingTaskId ? 'Edit Task' : 'Add Task'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Task Name"
                value={taskForm.name}
                onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={taskForm.status}
                  label="Status"
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as ProjectTask['status'] })}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTaskId ? 'Save Changes' : 'Add Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
