import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Divider,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Flag as FlagIcon,
  AccessTime as TimeIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
  Label as LabelIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignees: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  labels: string[];
  attachments: number;
  comments: number;
  sprintId?: string;
  estimate?: number;
  timeSpent?: number;
}

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  goals: string[];
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface Props {
  projectId: string;
  sprints: Sprint[];
  tasks: Task[];
  onTaskMove: (taskId: string, sourceCol: string, destinationCol: string, index: number) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
  onSprintCreate: (sprint: Omit<Sprint, 'id'>) => void;
  onSprintEdit: (sprint: Sprint) => void;
  onSprintDelete: (sprintId: string) => void;
}

export default function KanbanBoard({
  projectId,
  sprints,
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  onTaskCreate,
  onSprintCreate,
  onSprintEdit,
  onSprintDelete,
}: Props) {
  const [currentSprint, setCurrentSprint] = useState<string | null>(
    sprints.find(s => s.status === 'active')?.id || null
  );
  const [columns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', taskIds: [] },
    { id: 'in_progress', title: 'In Progress', taskIds: [] },
    { id: 'review', title: 'Review', taskIds: [] },
    { id: 'done', title: 'Done', taskIds: [] },
  ]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showSprintDialog, setShowSprintDialog] = useState(false);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignees: [],
    labels: [],
  });
  const [sprintForm, setSprintForm] = useState<Partial<Sprint>>({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'planning',
    goals: [],
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    const taskId = result.draggableId;

    onTaskMove(taskId, sourceCol, destCol, result.destination.index);
  };

  const getColumnTasks = (columnId: string) => {
    return tasks.filter(task => 
      task.status === columnId && 
      (!currentSprint || task.sprintId === currentSprint)
    );
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
    }
  };

  const renderTask = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ mb: 1 }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">{task.title}</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedTask(task);
                    setMenuAnchor(e.currentTarget);
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Stack>
              
              {task.description && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {task.description}
                </Typography>
              )}

              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  icon={<FlagIcon />}
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                />
                {task.dueDate && (
                  <Chip
                    size="small"
                    icon={<TimeIcon />}
                    label={format(new Date(task.dueDate), 'MMM d')}
                  />
                )}
              </Stack>

              {task.labels.length > 0 && (
                <Stack direction="row" spacing={0.5}>
                  {task.labels.map(label => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <AvatarGroup max={3}>
                  {task.assignees.map(assignee => (
                    <Tooltip key={assignee.id} title={assignee.name}>
                      <Avatar
                        src={assignee.avatar}
                        sx={{ width: 24, height: 24 }}
                      >
                        {assignee.name[0]}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>

                <Stack direction="row" spacing={1}>
                  {task.attachments > 0 && (
                    <Tooltip title={`${task.attachments} attachments`}>
                      <Badge badgeContent={task.attachments} color="primary">
                        <AttachmentIcon fontSize="small" />
                      </Badge>
                    </Tooltip>
                  )}
                  {task.comments > 0 && (
                    <Tooltip title={`${task.comments} comments`}>
                      <Badge badgeContent={task.comments} color="primary">
                        <CommentIcon fontSize="small" />
                      </Badge>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  const renderColumn = (column: Column) => (
    <Paper
      key={column.id}
      sx={{
        p: 2,
        minWidth: 280,
        maxWidth: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1">{column.title}</Typography>
          <Chip
            label={getColumnTasks(column.id).length}
            size="small"
            color="primary"
          />
        </Stack>
        <IconButton
          size="small"
          onClick={() => {
            setTaskForm({ ...taskForm, status: column.id });
            setShowTaskDialog(true);
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flexGrow: 1,
              minHeight: 100,
              overflowY: 'auto',
            }}
          >
            {getColumnTasks(column.id).map((task, index) => renderTask(task, index))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sprint</InputLabel>
            <Select
              value={currentSprint || ''}
              label="Sprint"
              onChange={(e) => setCurrentSprint(e.target.value)}
            >
              <MenuItem value="">All Tasks</MenuItem>
              {sprints.map(sprint => (
                <MenuItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowSprintDialog(true)}
          >
            New Sprint
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <FilterIcon />
          </IconButton>
          <IconButton>
            <SortIcon />
          </IconButton>
        </Stack>
      </Stack>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            flexGrow: 1,
            overflowX: 'auto',
            p: 1,
          }}
        >
          {columns.map(renderColumn)}
        </Stack>
      </DragDropContext>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedTask(null);
        }}
      >
        <MenuItem onClick={() => {
          if (selectedTask) {
            setTaskForm(selectedTask);
            setShowTaskDialog(true);
          }
          setMenuAnchor(null);
        }}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          Edit Task
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedTask) {
            onTaskDelete(selectedTask.id);
          }
          setMenuAnchor(null);
        }}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          Delete Task
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon><ArchiveIcon /></ListItemIcon>
          Archive Task
        </MenuItem>
      </Menu>

      <Dialog
        open={showTaskDialog}
        onClose={() => {
          setShowTaskDialog(false);
          setTaskForm({});
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {taskForm.id ? 'Edit Task' : 'Create Task'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={taskForm.title || ''}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={taskForm.description || ''}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority || 'medium'}
                label="Priority"
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={taskForm.dueDate ? format(new Date(taskForm.dueDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: new Date(e.target.value) })}
            />
            <TextField
              label="Labels"
              fullWidth
              value={taskForm.labels?.join(', ') || ''}
              onChange={(e) => setTaskForm({
                ...taskForm,
                labels: e.target.value.split(',').map(l => l.trim()),
              })}
              helperText="Separate labels with commas"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowTaskDialog(false);
            setTaskForm({});
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (taskForm.id) {
                onTaskEdit(taskForm as Task);
              } else {
                onTaskCreate(taskForm as Omit<Task, 'id'>);
              }
              setShowTaskDialog(false);
              setTaskForm({});
            }}
          >
            {taskForm.id ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showSprintDialog}
        onClose={() => {
          setShowSprintDialog(false);
          setSprintForm({});
        }}
        fullWidth
      >
        <DialogTitle>
          {sprintForm.id ? 'Edit Sprint' : 'Create Sprint'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Sprint Name"
              fullWidth
              value={sprintForm.name || ''}
              onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sprintForm.startDate ? format(new Date(sprintForm.startDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => setSprintForm({ ...sprintForm, startDate: new Date(e.target.value) })}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sprintForm.endDate ? format(new Date(sprintForm.endDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => setSprintForm({ ...sprintForm, endDate: new Date(e.target.value) })}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={sprintForm.status || 'planning'}
                label="Status"
                onChange={(e) => setSprintForm({ ...sprintForm, status: e.target.value as Sprint['status'] })}
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Sprint Goals"
              fullWidth
              multiline
              rows={3}
              value={sprintForm.goals?.join('\n') || ''}
              onChange={(e) => setSprintForm({
                ...sprintForm,
                goals: e.target.value.split('\n').filter(g => g.trim()),
              })}
              helperText="Enter each goal on a new line"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowSprintDialog(false);
            setSprintForm({});
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (sprintForm.id) {
                onSprintEdit(sprintForm as Sprint);
              } else {
                onSprintCreate(sprintForm as Omit<Sprint, 'id'>);
              }
              setShowSprintDialog(false);
              setSprintForm({});
            }}
          >
            {sprintForm.id ? 'Save Changes' : 'Create Sprint'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
