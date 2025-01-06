import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Avatar,
  Chip,
  Badge,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Business as CompanyIcon,
  People as ContactsIcon,
  Chat as ChatIcon,
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Timeline as SprintIcon,
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
  Notifications as PingIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

interface ClientContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  lastActive: Date;
}

interface Client {
  id: string;
  companyName: string;
  logo?: string;
  contacts: ClientContact[];
  projects: Project[];
  documents: Document[];
  status: 'active' | 'inactive';
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  sprints: Sprint[];
  progress: number;
  startDate: Date;
  endDate: Date;
}

interface Sprint {
  id: string;
  name: string;
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  progress: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  assignedTo: string[];
  assignedBy: string;
  deadline: Date;
  attachments: string[];
  comments: Comment[];
  checklist: ChecklistItem[];
  tags: string[];
  timeTracking: {
    estimated: number;
    spent: number;
  };
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  attachments: string[];
}

interface Ping {
  id: string;
  from: string;
  to: string[];
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Props {
  clients: Client[];
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  onAddClient: (client: Partial<Client>) => void;
  onAddContact: (clientId: string, contact: Partial<ClientContact>) => void;
}

export default function ClientDashboard({
  clients,
  currentUser,
  onAddClient,
  onAddContact,
}: Props) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedView, setSelectedView] = useState<'projects' | 'contacts' | 'documents'>('projects');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [showPings, setShowPings] = useState(false);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setExpandedClient(expandedClient === client.id ? null : client.id);
  };

  const renderBreadcrumbs = () => (
    <Breadcrumbs
      separator={<NextIcon fontSize="small" />}
      sx={{ mb: 3 }}
    >
      <Link
        color="inherit"
        href="#"
        onClick={() => {
          setSelectedClient(null);
          setSelectedView('projects');
        }}
      >
        Dashboard
      </Link>
      {selectedClient && (
        <Link
          color="inherit"
          href="#"
          onClick={() => setSelectedClient(selectedClient)}
        >
          {selectedClient.companyName}
        </Link>
      )}
      {selectedClient && selectedView && (
        <Typography color="text.primary">
          {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}
        </Typography>
      )}
    </Breadcrumbs>
  );

  const renderClientList = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Clients
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowAddClient(true)}
            >
              Add Client
            </Button>
          </Stack>
          <TextField
            fullWidth
            placeholder="Search clients..."
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
          <List>
            {clients.map(client => (
              <React.Fragment key={client.id}>
                <ListItemButton
                  selected={selectedClient?.id === client.id}
                  onClick={() => handleClientClick(client)}
                >
                  <ListItemIcon>
                    {client.logo ? (
                      <Avatar src={client.logo} />
                    ) : (
                      <CompanyIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={client.companyName}
                    secondary={`${client.contacts.length} contacts`}
                  />
                  {expandedClient === client.id ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse
                  in={expandedClient === client.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => setSelectedView('projects')}
                    >
                      <ListItemIcon>
                        <Timeline />
                      </ListItemIcon>
                      <ListItemText primary="Projects" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => setSelectedView('contacts')}
                    >
                      <ListItemIcon>
                        <ContactsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Contacts" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => setSelectedView('documents')}
                    >
                      <ListItemIcon>
                        <DocumentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Documents" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderMainContent = () => {
    if (!selectedClient) {
      return (
        <Typography variant="h6" align="center">
          Select a client to view details
        </Typography>
      );
    }

    switch (selectedView) {
      case 'projects':
        return (
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Projects
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
              >
                New Project
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {selectedClient.projects.map(project => (
                <Grid item xs={12} md={6} key={project.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography variant="h6">
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {project.description}
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Chip
                            label={project.status}
                            color={
                              project.status === 'active' ? 'success' :
                              project.status === 'planning' ? 'warning' :
                              'default'
                            }
                          />
                          <Typography variant="body2">
                            {project.progress}% Complete
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        );

      case 'contacts':
        return (
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Contacts
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setShowAddContact(true)}
              >
                Add Contact
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {selectedClient.contacts.map(contact => (
                <Grid item xs={12} md={6} key={contact.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={contact.avatar}>
                            {contact.name[0]}
                          </Avatar>
                          <Stack>
                            <Typography variant="h6">
                              {contact.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {contact.role}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            {contact.email}
                          </Typography>
                          <Typography variant="body2">
                            {contact.phone}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Last active: {new Date(contact.lastActive).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        );

      case 'documents':
        return (
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Documents
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
              >
                Upload Document
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {selectedClient.documents.map(doc => (
                <Grid item xs={12} md={6} key={doc.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <DocumentIcon />
                          <Typography variant="h6">
                            {doc.name}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {doc.description}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Button size="small">
                            Download
                          </Button>
                          <Button size="small">
                            Share
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        );
    }
  };

  const renderPingsDrawer = () => (
    <Drawer
      anchor="right"
      open={showPings}
      onClose={() => setShowPings(false)}
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">
            Pings
          </Typography>
          <TextField
            fullWidth
            placeholder="Search messages..."
            size="small"
          />
          <List>
            {/* Render pings here */}
          </List>
        </Stack>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Top Bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {renderBreadcrumbs()}
          <Stack direction="row" spacing={2}>
            <IconButton onClick={() => setShowPings(true)}>
              <Badge badgeContent={4} color="error">
                <PingIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            {renderClientList()}
          </Grid>
          <Grid item xs={12} md={9}>
            {renderMainContent()}
          </Grid>
        </Grid>
      </Stack>

      {renderPingsDrawer()}

      {/* Add Client Dialog */}
      <Dialog
        open={showAddClient}
        onClose={() => setShowAddClient(false)}
      >
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          {/* Add client form */}
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog
        open={showAddContact}
        onClose={() => setShowAddContact(false)}
      >
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          {/* Add contact form */}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
