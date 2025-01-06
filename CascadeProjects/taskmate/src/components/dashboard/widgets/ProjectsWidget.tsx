import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEntityStore } from '../../../stores/entityStore';
import { ProjectForm } from '../../forms/ProjectForm';

export function ProjectsWidget() {
  const { projects, tasks } = useEntityStore();
  const [openForm, setOpenForm] = useState(false);

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    return (completedTasks.length / projectTasks.length) * 100;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Projects</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          variant="contained"
          size="small"
        >
          Add Project
        </Button>
      </Box>

      <List>
        {projects.map((project) => {
          const progress = getProjectProgress(project.id);
          
          return (
            <ListItem
              key={project.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={project.name}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {project.clientName}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <ProjectForm onClose={() => setOpenForm(false)} />
      </Dialog>
    </Box>
  );
}
