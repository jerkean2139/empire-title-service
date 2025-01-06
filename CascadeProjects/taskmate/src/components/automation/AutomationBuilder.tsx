import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Notifications as NotificationIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import { Automation, EmailTemplate } from '../../types/client';

interface Props {
  automations: Automation[];
  emailTemplates: EmailTemplate[];
  onCreateAutomation: (automation: Omit<Automation, 'id'>) => void;
  onEditAutomation: (id: string, automation: Partial<Automation>) => void;
  onDeleteAutomation: (id: string) => void;
  onToggleAutomation: (id: string, enabled: boolean) => void;
  onRunAutomation: (id: string) => void;
}

export default function AutomationBuilder({
  automations,
  emailTemplates,
  onCreateAutomation,
  onEditAutomation,
  onDeleteAutomation,
  onToggleAutomation,
  onRunAutomation,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'reminder' as Automation['type'],
    trigger: {
      type: 'schedule' as 'schedule' | 'event' | 'condition',
      config: {},
    },
    action: {
      type: 'email',
      config: {},
    },
    enabled: true,
  });

  const handleOpen = (automation?: Automation) => {
    if (automation) {
      setFormData({
        name: automation.name,
        type: automation.type,
        trigger: automation.trigger,
        action: automation.action,
        enabled: automation.enabled,
      });
      setEditingId(automation.id);
    } else {
      setFormData({
        name: '',
        type: 'reminder',
        trigger: {
          type: 'schedule',
          config: {},
        },
        action: {
          type: 'email',
          config: {},
        },
        enabled: true,
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditAutomation(editingId, formData);
    } else {
      onCreateAutomation(formData);
    }
    setOpen(false);
  };

  const renderTriggerConfig = () => {
    switch (formData.trigger.type) {
      case 'schedule':
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.trigger.config.frequency || 'daily'}
                  label="Frequency"
                  onChange={(e) => setFormData({
                    ...formData,
                    trigger: {
                      ...formData.trigger,
                      config: { ...formData.trigger.config, frequency: e.target.value },
                    },
                  })}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={formData.trigger.config.time || '09:00'}
                onChange={(e) => setFormData({
                  ...formData,
                  trigger: {
                    ...formData.trigger,
                    config: { ...formData.trigger.config, time: e.target.value },
                  },
                })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );

      case 'event':
        return (
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={formData.trigger.config.eventType || 'client_created'}
              label="Event Type"
              onChange={(e) => setFormData({
                ...formData,
                trigger: {
                  ...formData.trigger,
                  config: { ...formData.trigger.config, eventType: e.target.value },
                },
              })}
            >
              <MenuItem value="client_created">Client Created</MenuItem>
              <MenuItem value="project_completed">Project Completed</MenuItem>
              <MenuItem value="task_overdue">Task Overdue</MenuItem>
              <MenuItem value="document_uploaded">Document Uploaded</MenuItem>
            </Select>
          </FormControl>
        );

      case 'condition':
        return (
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Field</InputLabel>
              <Select
                value={formData.trigger.config.field || 'status'}
                label="Field"
                onChange={(e) => setFormData({
                  ...formData,
                  trigger: {
                    ...formData.trigger,
                    config: { ...formData.trigger.config, field: e.target.value },
                  },
                })}
              >
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="engagement_score">Engagement Score</MenuItem>
                <MenuItem value="last_contact">Last Contact</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={formData.trigger.config.operator || 'equals'}
                label="Operator"
                onChange={(e) => setFormData({
                  ...formData,
                  trigger: {
                    ...formData.trigger,
                    config: { ...formData.trigger.config, operator: e.target.value },
                  },
                })}
              >
                <MenuItem value="equals">Equals</MenuItem>
                <MenuItem value="not_equals">Not Equals</MenuItem>
                <MenuItem value="greater_than">Greater Than</MenuItem>
                <MenuItem value="less_than">Less Than</MenuItem>
                <MenuItem value="contains">Contains</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Value"
              value={formData.trigger.config.value || ''}
              onChange={(e) => setFormData({
                ...formData,
                trigger: {
                  ...formData.trigger,
                  config: { ...formData.trigger.config, value: e.target.value },
                },
              })}
            />
          </Stack>
        );
    }
  };

  const renderActionConfig = () => {
    switch (formData.action.type) {
      case 'email':
        return (
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Email Template</InputLabel>
              <Select
                value={formData.action.config.templateId || ''}
                label="Email Template"
                onChange={(e) => setFormData({
                  ...formData,
                  action: {
                    ...formData.action,
                    config: { ...formData.action.config, templateId: e.target.value },
                  },
                })}
              >
                {emailTemplates.map(template => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Recipients"
              placeholder="Enter email addresses"
              value={formData.action.config.recipients || ''}
              onChange={(e) => setFormData({
                ...formData,
                action: {
                  ...formData.action,
                  config: { ...formData.action.config, recipients: e.target.value },
                },
              })}
            />
          </Stack>
        );

      case 'task':
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Task Name"
              value={formData.action.config.taskName || ''}
              onChange={(e) => setFormData({
                ...formData,
                action: {
                  ...formData.action,
                  config: { ...formData.action.config, taskName: e.target.value },
                },
              })}
            />
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={formData.action.config.assignTo || 'owner'}
                label="Assign To"
                onChange={(e) => setFormData({
                  ...formData,
                  action: {
                    ...formData.action,
                    config: { ...formData.action.config, assignTo: e.target.value },
                  },
                })}
              >
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="team">Team</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Due In (days)"
              type="number"
              value={formData.action.config.dueInDays || '1'}
              onChange={(e) => setFormData({
                ...formData,
                action: {
                  ...formData.action,
                  config: { ...formData.action.config, dueInDays: e.target.value },
                },
              })}
            />
          </Stack>
        );

      case 'notification':
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message"
              value={formData.action.config.message || ''}
              onChange={(e) => setFormData({
                ...formData,
                action: {
                  ...formData.action,
                  config: { ...formData.action.config, message: e.target.value },
                },
              })}
            />
            <FormControl fullWidth>
              <InputLabel>Channel</InputLabel>
              <Select
                value={formData.action.config.channel || 'app'}
                label="Channel"
                onChange={(e) => setFormData({
                  ...formData,
                  action: {
                    ...formData.action,
                    config: { ...formData.action.config, channel: e.target.value },
                  },
                })}
              >
                <MenuItem value="app">In-App</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Automations</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Create Automation
            </Button>
          </Box>

          <List>
            {automations.map(automation => (
              <Paper key={automation.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1">{automation.name}</Typography>
                        <Chip
                          label={automation.type}
                          size="small"
                          color={automation.enabled ? 'primary' : 'default'}
                        />
                        {automation.lastRun && (
                          <Typography variant="caption" color="text.secondary">
                            Last run: {new Date(automation.lastRun).toLocaleString()}
                          </Typography>
                        )}
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          icon={
                            automation.trigger.type === 'schedule' ? <ScheduleIcon /> :
                            automation.trigger.type === 'event' ? <NotificationIcon /> :
                            <SettingsIcon />
                          }
                          label={`Trigger: ${automation.trigger.type}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={
                            automation.action.type === 'email' ? <EmailIcon /> :
                            automation.action.type === 'task' ? <TaskIcon /> :
                            <NotificationIcon />
                          }
                          label={`Action: ${automation.action.type}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={automation.enabled}
                            onChange={(e) => onToggleAutomation(automation.id, e.target.checked)}
                          />
                        }
                        label={automation.enabled ? 'Enabled' : 'Disabled'}
                      />
                      <IconButton
                        color="primary"
                        onClick={() => onRunAutomation(automation.id)}
                      >
                        <PlayIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpen(automation)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDeleteAutomation(automation.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Automation' : 'Create Automation'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Automation Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Automation['type'] })}
                >
                  <MenuItem value="reminder">Reminder</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="notification">Notification</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Trigger
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Trigger Type</InputLabel>
                  <Select
                    value={formData.trigger.type}
                    label="Trigger Type"
                    onChange={(e) => setFormData({
                      ...formData,
                      trigger: {
                        type: e.target.value as 'schedule' | 'event' | 'condition',
                        config: {},
                      },
                    })}
                  >
                    <MenuItem value="schedule">Schedule</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="condition">Condition</MenuItem>
                  </Select>
                </FormControl>
                {renderTriggerConfig()}
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Action
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Action Type</InputLabel>
                  <Select
                    value={formData.action.type}
                    label="Action Type"
                    onChange={(e) => setFormData({
                      ...formData,
                      action: {
                        type: e.target.value,
                        config: {},
                      },
                    })}
                  >
                    <MenuItem value="email">Send Email</MenuItem>
                    <MenuItem value="task">Create Task</MenuItem>
                    <MenuItem value="notification">Send Notification</MenuItem>
                  </Select>
                </FormControl>
                {renderActionConfig()}
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                }
                label="Enable Automation"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Save Changes' : 'Create Automation'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
