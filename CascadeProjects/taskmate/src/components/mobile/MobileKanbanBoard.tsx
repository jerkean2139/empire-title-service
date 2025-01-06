import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  Fab,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Tabs,
  Tab,
  Menu,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  Flag as FlagIcon,
  AccessTime as TimeIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewKanban as KanbanIcon,
  ViewList as ListIcon,
  Assessment as MetricsIcon,
  Description as TaskIcon,
  Done as DoneIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface Props {
  tasks: Task[];
  onTaskMove: (taskId: string, sourceCol: string, destinationCol: string, index: number) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

export default function MobileKanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  onTaskCreate,
}: Props) {
  const [currentView, setCurrentView] = useState<'kanban' | 'list'>('kanban');
  const [currentStatus, setCurrentStatus] = useState<Task['status']>('todo');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignees: [],
    labels: [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: Column[] = [
    { id: 'todo', title: 'To Do', taskIds: [] },
    { id: 'in_progress', title: 'In Progress', taskIds: [] },
    { id: 'review', title: 'Review', taskIds: [] },
    { id: 'done', title: 'Done', taskIds: [] },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    const taskId = result.draggableId;

    onTaskMove(taskId, sourceCol, destCol, result.destination.index);
  };

  const getColumnTasks = (columnId: string) => {
    return tasks.filter(task => task.status === columnId);
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
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ m: 1 }}
        >
          <Box sx={{ p: 2 }}>
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
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                  {task.labels.map(label => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={-0.5}>
                  {task.assignees.map(assignee => (
                    <Avatar
                      key={assignee.id}
                      src={assignee.avatar}
                      sx={{ width: 24, height: 24, border: '2px solid white' }}
                    >
                      {assignee.name[0]}
                    </Avatar>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1}>
                  {task.attachments > 0 && (
                    <Badge badgeContent={task.attachments} color="primary">
                      <AttachmentIcon fontSize="small" />
                    </Badge>
                  )}
                  {task.comments > 0 && (
                    <Badge badgeContent={task.comments} color="primary">
                      <CommentIcon fontSize="small" />
                    </Badge>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      )}
    </Draggable>
  );

  const renderKanbanView = () => (
    <Box sx={{ height: 'calc(100vh - 112px)', overflow: 'hidden' }}>
      <Tabs
        value={currentStatus}
        onChange={(_, value) => setCurrentStatus(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {columns.map(column => (
          <Tab
            key={column.id}
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{column.title}</Typography>
                <Chip
                  label={getColumnTasks(column.id).length}
                  size="small"
                  color="primary"
                />
              </Stack>
            }
            value={column.id}
          />
        ))}
      </Tabs>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={currentStatus}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                height: '100%',
                overflow: 'auto',
                p: 1,
              }}
            >
              {getColumnTasks(currentStatus).map((task, index) => renderTask(task, index))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );

  const renderListView = () => (
    <List sx={{ pb: 7 }}>
      {tasks.map(task => (
        <ListItem
          key={task.id}
          button
          onClick={() => {
            setSelectedTask(task);
            setTaskForm(task);
            setShowTaskDialog(true);
          }}
        >
          <ListItemIcon>
            <TaskIcon color={getPriorityColor(task.priority)} />
          </ListItemIcon>
          <ListItemText
            primary={task.title}
            secondary={
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={task.status}
                  color="primary"
                />
                {task.dueDate && (
                  <Typography variant="caption">
                    Due {format(new Date(task.dueDate), 'MMM d')}
                  </Typography>
                )}
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
            Tasks
          </Typography>
          <IconButton color="inherit">
            <FilterIcon />
          </IconButton>
          <IconButton color="inherit">
            <SortIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {currentView === 'kanban' ? renderKanbanView() : renderListView()}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 72, right: 16 }}
        onClick={() => {
          setTaskForm({ status: currentStatus });
          setShowTaskDialog(true);
        }}
      >
        <AddIcon />
      </Fab>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          value={currentView}
          onChange={(_, newValue) => setCurrentView(newValue)}
        >
          <BottomNavigationAction
            label="Kanban"
            value="kanban"
            icon={<KanbanIcon />}
          />
          <BottomNavigationAction
            label="List"
            value="list"
            icon={<ListIcon />}
          />
          <BottomNavigationAction
            label="Metrics"
            value="metrics"
            icon={<MetricsIcon />}
          />
        </BottomNavigation>
      </Paper>

      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <Box sx={{ width: 280 }}>
          <List>
            <ListItem>
              <ListItemText
                primary="Sprint 1"
                secondary="Jan 1 - Jan 14"
              />
            </ListItem>
            <Divider />
            {columns.map(column => (
              <ListItem
                key={column.id}
                button
                selected={currentStatus === column.id}
                onClick={() => {
                  setCurrentStatus(column.id);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText
                  primary={column.title}
                  secondary={`${getColumnTasks(column.id).length} tasks`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>

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
        fullScreen
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setShowTaskDialog(false);
                setTaskForm({});
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {taskForm.id ? 'Edit Task' : 'Create Task'}
            </Typography>
            <Button
              color="inherit"
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
              {taskForm.id ? 'Save' : 'Create'}
            </Button>
          </Toolbar>
        </AppBar>
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
      </Dialog>
    </Box>
  );
}
