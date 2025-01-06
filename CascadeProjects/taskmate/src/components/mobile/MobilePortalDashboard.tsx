import React, { useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Paper,
  Fab,
  Badge,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Message as MessageIcon,
  Notifications as NotificationIcon,
  Add as AddIcon,
  Event as EventIcon,
  AttachMoney as InvoiceIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Mail as EmailIcon,
  Phone as PhoneIcon,
  VideoCall as VideoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Company, TeamMember, Project, ProjectTask, Document, Communication } from '../../types/client';

interface Props {
  company: Company;
  teamMember: TeamMember;
  projects: Project[];
  tasks: ProjectTask[];
  documents: Document[];
  communications: Communication[];
  onNavigate: (view: string) => void;
  onCreateTask: () => void;
  onUploadDocument: () => void;
  onStartChat: () => void;
  onScheduleMeeting: () => void;
}

export default function MobilePortalDashboard({
  company,
  teamMember,
  projects,
  tasks,
  documents,
  communications,
  onNavigate,
  onCreateTask,
  onUploadDocument,
  onStartChat,
  onScheduleMeeting,
}: Props) {
  const [navValue, setNavValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const renderHeader = () => (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        bgcolor: 'background.paper',
        p: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          TaskMate
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );

  const renderWelcomeCard = () => (
    <Card sx={{ mx: 2, mt: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{ width: 48, height: 48 }}
            src={teamMember.customFields.avatar}
          >
            {teamMember.firstName[0]}{teamMember.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">
              Welcome, {teamMember.firstName}!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {tasks.filter(t => t.status === 'todo').length} tasks pending
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderTasks = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Today's Tasks
      </Typography>
      <Stack spacing={2}>
        {tasks
          .filter(task => task.assignedTo?.includes(teamMember.id))
          .map(task => (
            <Paper
              key={task.id}
              sx={{ p: 2 }}
              elevation={1}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">{task.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={task.status}
                    size="small"
                    color={
                      task.status === 'completed' ? 'success' :
                      task.status === 'in_progress' ? 'warning' : 'error'
                    }
                  />
                  {task.dueDate && (
                    <Typography variant="caption">
                      Due: {format(new Date(task.dueDate), 'MMM d')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
      </Stack>
    </Box>
  );

  const renderProjects = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Active Projects
      </Typography>
      <Stack spacing={2}>
        {projects
          .filter(p => p.status === 'in_progress')
          .map(project => (
            <Paper
              key={project.id}
              sx={{ p: 2 }}
              elevation={1}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">{project.name}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={project.completionPercentage}
                  sx={{ height: 6, borderRadius: 1 }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`${project.completionPercentage}%`}
                    size="small"
                    color="primary"
                  />
                  {project.endDate && (
                    <Typography variant="caption">
                      Due: {format(new Date(project.endDate), 'MMM d')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
      </Stack>
    </Box>
  );

  const renderDocuments = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Recent Documents
      </Typography>
      <Stack spacing={2}>
        {documents
          .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
          .slice(0, 5)
          .map(doc => (
            <Paper
              key={doc.id}
              sx={{ p: 2 }}
              elevation={1}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <DocumentIcon color="action" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">{doc.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                  </Typography>
                </Box>
                <Chip label={`v${doc.version}`} size="small" />
              </Stack>
            </Paper>
          ))}
      </Stack>
    </Box>
  );

  const speedDialActions = [
    { icon: <TaskIcon />, name: 'New Task', onClick: onCreateTask },
    { icon: <DocumentIcon />, name: 'Upload Document', onClick: onUploadDocument },
    { icon: <MessageIcon />, name: 'Start Chat', onClick: onStartChat },
    { icon: <EventIcon />, name: 'Schedule Meeting', onClick: onScheduleMeeting },
  ];

  return (
    <Box sx={{ pb: 7, height: '100vh', overflow: 'auto' }}>
      {renderHeader()}
      {navValue === 0 && (
        <>
          {renderWelcomeCard()}
          {renderTasks()}
          {renderProjects()}
        </>
      )}
      {navValue === 1 && renderTasks()}
      {navValue === 2 && renderDocuments()}
      {navValue === 3 && <Box sx={{ p: 2 }}>Messages View</Box>}

      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 72, right: 16 }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.onClick();
              setSpeedDialOpen(false);
            }}
          />
        ))}
      </SpeedDial>

      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => setNavValue(newValue)}
        >
          <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Tasks" icon={<TaskIcon />} />
          <BottomNavigationAction label="Documents" icon={<DocumentIcon />} />
          <BottomNavigationAction
            label="Messages"
            icon={
              <Badge badgeContent={2} color="error">
                <MessageIcon />
              </Badge>
            }
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
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{ width: 48, height: 48 }}
                src={company.logo}
              >
                {company.name[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{company.name}</Typography>
                <Typography variant="body2">{teamMember.role}</Typography>
              </Box>
            </Stack>
          </Box>
          <List>
            <ListItem button onClick={() => onNavigate('profile')}>
              <ListItemIcon><Avatar sx={{ width: 24, height: 24 }}>{teamMember.firstName[0]}</Avatar></ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={() => onNavigate('notifications')}>
              <ListItemIcon><NotificationIcon /></ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem button onClick={() => onNavigate('settings')}>
              <ListItemIcon><FilterIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => onNavigate('email')}>
              <ListItemIcon><EmailIcon /></ListItemIcon>
              <ListItemText primary="Email" />
            </ListItem>
            <ListItem button onClick={() => onNavigate('call')}>
              <ListItemIcon><PhoneIcon /></ListItemIcon>
              <ListItemText primary="Call" />
            </ListItem>
            <ListItem button onClick={() => onNavigate('video')}>
              <ListItemIcon><VideoIcon /></ListItemIcon>
              <ListItemText primary="Video Meeting" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}
