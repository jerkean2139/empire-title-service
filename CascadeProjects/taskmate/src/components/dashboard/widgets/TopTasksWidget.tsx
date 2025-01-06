import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useEntityStore } from "../../../stores/entityStore";
import { Task } from "../../../types/entities";
import { TaskForm } from "../../forms/TaskForm";

interface SortableTaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

function SortableTaskItem({ task, onEdit }: SortableTaskItemProps) {
  const theme = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging 
      ? alpha(theme.palette.primary.main, 0.1)
      : 'transparent',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        cursor: 'grab',
        borderRadius: 1,
        mb: 1,
      }}
    >
      <IconButton size="small" {...listeners}>
        <DragIndicatorIcon />
      </IconButton>
      <ListItemText
        primary={task.title}
        secondary={task.description}
        primaryTypographyProps={{
          variant: "body2",
          sx: { 
            fontWeight: task.priority === 'high' ? 'bold' : 'normal',
            color: task.priority === 'high' 
              ? theme.palette.error.main 
              : theme.palette.text.primary
          }
        }}
        secondaryTypographyProps={{
          variant: "caption",
          sx: { 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }
        }}
      />
      <ListItemSecondaryAction>
        <IconButton 
          edge="end" 
          size="small"
          onClick={() => onEdit(task)}
        >
          <AddIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export function TopTasksWidget() {
  const theme = useTheme();
  const { tasks } = useEntityStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const priorityTasks = tasks
    .filter(task => !task.completed && task.priority === 'high')
    .slice(0, 5);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
    setIsDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Top Tasks
      </Typography>

      <List sx={{ mt: 2 }}>
        {priorityTasks.map((task) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            onEdit={handleEditTask}
          />
        ))}
      </List>

      {priorityTasks.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 2 }}
        >
          No high priority tasks
        </Typography>
      )}

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Task
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <TaskForm
              initialValues={selectedTask}
              onSubmit={(values) => {
                console.log('Updated task:', values);
                handleCloseDialog();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button 
            type="submit"
            form="task-form"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
