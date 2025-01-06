import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Grid,
  LinearProgress,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { useEntityStore } from '../../stores/entityStore';
import { useAuth } from '../../contexts/AuthContext';

export function UserDashboard() {
  const { currentUser } = useAuth();
  const { clients, projects, sprints, tasks } = useEntityStore();

  const activeSprints = sprints.filter(sprint => sprint.status === 'active');
  const upcomingTasks = tasks
    .filter(task => task.status === 'todo')
    .sort((a, b) => (a.dueDate && b.dueDate ? a.dueDate.getTime() - b.dueDate.getTime() : 0))
    .slice(0, 5);

  const getSprintProgress = (sprintId: string) => {
    const sprintTasks = tasks.filter(task => task.sprintId === sprintId);
    if (sprintTasks.length === 0) return 0;
    const completedTasks = sprintTasks.filter(task => task.status === 'done').length;
    return (completedTasks / sprintTasks.length) * 100;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Welcome, {currentUser?.displayName || 'User'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <BusinessIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{clients.length}</Typography>
            <Typography variant="body2" color="text.secondary">Clients</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <AccountTreeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{projects.length}</Typography>
            <Typography variant="body2" color="text.secondary">Projects</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <DirectionsRunIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{sprints.length}</Typography>
            <Typography variant="body2" color="text.secondary">Sprints</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <AssignmentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{tasks.length}</Typography>
            <Typography variant="body2" color="text.secondary">Tasks</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Active Sprints
        </Typography>
        <List>
          {activeSprints.map((sprint) => (
            <Box key={sprint.id}>
              <ListItem>
                <ListItemIcon>
                  <DirectionsRunIcon />
                </ListItemIcon>
                <ListItemText
                  primary={sprint.name}
                  secondary={
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Progress</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(getSprintProgress(sprint.id))}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={getSprintProgress(sprint.id)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </Box>
          ))}
          {activeSprints.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No active sprints"
                secondary="Start a new sprint to track your progress"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upcoming Tasks
        </Typography>
        <List>
          {upcomingTasks.map((task) => (
            <Box key={task.id}>
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={task.title}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {task.dueDate && (
                        <Typography variant="body2" color="text.secondary">
                          Due: {task.dueDate.toLocaleDateString()}
                        </Typography>
                      )}
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === 'high' ? 'error' :
                          task.priority === 'medium' ? 'warning' :
                          'default'
                        }
                      />
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </Box>
          ))}
          {upcomingTasks.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No upcoming tasks"
                secondary="Add tasks to start tracking your work"
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}
