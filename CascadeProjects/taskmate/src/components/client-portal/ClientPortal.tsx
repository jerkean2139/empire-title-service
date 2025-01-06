import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
  TimelineConnector,
  timelineItemClasses,
} from '@mui/lab';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import { useEntityStore } from '../../stores/entityStore';
import { ChatConsole } from '../dashboard/ChatConsole';

export function ClientPortal() {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { projects, tasks } = useEntityStore();

  const projectTasks = tasks.filter(task => 
    selectedProject ? task.projectId === selectedProject : true
  );

  return (
    <Box sx={{ p: 3, height: '100vh', bgcolor: theme.palette.background.default }}>
      <Grid container spacing={3}>
        {/* Projects List */}
        <Grid item xs={12} md={3}>
          <Paper 
            sx={{ 
              p: 2, 
              height: '100%',
              bgcolor: theme.palette.background.paper,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <List>
              {projects.map(project => (
                <ListItem 
                  key={project.id} 
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemButton
                    selected={selectedProject === project.id}
                    onClick={() => setSelectedProject(project.id)}
                    sx={{
                      borderRadius: 1,
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <FolderIcon color={selectedProject === project.id ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={project.title}
                      secondary={`${tasks.filter(t => t.projectId === project.id).length} tasks`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Timeline */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              height: '100%',
              bgcolor: theme.palette.background.paper,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}
            >
              {projectTasks.map(task => (
                <TimelineItem key={task.id}>
                  <TimelineSeparator>
                    <TimelineDot 
                      color={
                        task.priority === 'high' ? 'error' :
                        task.priority === 'medium' ? 'warning' :
                        'success'
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      {task.scheduledDate && (
                        <Typography variant="caption" color="text.secondary">
                          Due: {new Date(task.scheduledDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>

        {/* Chat Console */}
        <Grid item xs={12} md={3}>
          <Paper 
            sx={{ 
              p: 2, 
              height: '100%',
              bgcolor: theme.palette.background.paper,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                Chat
              </Typography>
              <IconButton color="primary">
                <ChatIcon />
              </IconButton>
            </Box>
            <ChatConsole />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
