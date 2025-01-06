import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Badge,
  Divider,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Message as MessageIcon,
  Notifications as NotificationIcon,
  Event as EventIcon,
  AttachMoney as InvoiceIcon,
  Schedule as TimelineIcon,
  People as TeamIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Project, ProjectTask, Document, Communication, TeamMember } from '../../types/client';

interface Props {
  companyId: string;
  teamMember: TeamMember;
  projects: Project[];
  documents: Document[];
  communications: Communication[];
  tasks: ProjectTask[];
  onViewProject: (projectId: string) => void;
  onViewDocument: (documentId: string) => void;
  onSendMessage: (message: string) => void;
  onUpdateTask: (taskId: string, status: ProjectTask['status']) => void;
}

export default function ClientPortalDashboard({
  companyId,
  teamMember,
  projects,
  documents,
  communications,
  tasks,
  onViewProject,
  onViewDocument,
  onSendMessage,
  onUpdateTask,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [unreadNotifications] = useState(3); // Replace with actual notification count

  const renderWelcomeCard = () => (
    <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{ width: 64, height: 64 }}
              src={teamMember.customFields.avatar}
            >
              {teamMember.firstName[0]}{teamMember.lastName[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5">
              Welcome back, {teamMember.firstName}!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              You have {tasks.filter(t => t.status === 'todo').length} pending tasks
              and {unreadNotifications} unread notifications
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MessageIcon />}
              >
                Send Message
              </Button>
              <IconButton color="inherit">
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderProjectsSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Active Projects
        </Typography>
        <List>
          {projects
            .filter(p => p.status === 'in_progress')
            .map(project => (
              <ListItem
                key={project.id}
                button
                onClick={() => onViewProject(project.id)}
              >
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={`${project.completionPercentage}%`}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="caption">
                        Due: {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'No due date'}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderTasksSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Tasks
        </Typography>
        <List>
          {tasks
            .filter(task => task.assignedTo?.includes(teamMember.id))
            .map(task => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <Button
                    size="small"
                    variant="outlined"
                    color={task.status === 'completed' ? 'success' : 'primary'}
                    onClick={() => onUpdateTask(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                }
              >
                <ListItemIcon>
                  <TaskIcon color={task.status === 'completed' ? 'success' : 'action'} />
                </ListItemIcon>
                <ListItemText
                  primary={task.name}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === 'high' ? 'error' :
                          task.priority === 'medium' ? 'warning' : 'default'
                        }
                      />
                      {task.dueDate && (
                        <Typography variant="caption">
                          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </Typography>
                      )}
                    </Stack>
                  }
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderDocumentsSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Documents
        </Typography>
        <List>
          {documents
            .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
            .slice(0, 5)
            .map(doc => (
              <ListItem
                key={doc.id}
                button
                onClick={() => onViewDocument(doc.id)}
              >
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={doc.name}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption">
                        {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                      </Typography>
                      <Chip
                        label={`v${doc.version}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  }
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderCommunicationSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Communications
        </Typography>
        <List>
          {communications
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5)
            .map(comm => (
              <ListItem key={comm.id}>
                <ListItemIcon>
                  {comm.type === 'email' ? <MessageIcon /> :
                   comm.type === 'meeting' ? <EventIcon /> :
                   comm.type === 'call' ? <PhoneIcon /> : <NotificationIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={comm.subject}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption">
                        {format(new Date(comm.date), 'MMM d, yyyy')}
                      </Typography>
                      <Chip
                        label={comm.type}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  }
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {renderWelcomeCard()}
      
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Projects" />
        <Tab label="Tasks" />
        <Tab label="Documents" />
        <Tab label="Communications" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderProjectsSection()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderTasksSection()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderDocumentsSection()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderCommunicationSection()}
          </Grid>
        </Grid>
      )}
      {activeTab === 1 && renderProjectsSection()}
      {activeTab === 2 && renderTasksSection()}
      {activeTab === 3 && renderDocumentsSection()}
      {activeTab === 4 && renderCommunicationSection()}
    </Box>
  );
}
