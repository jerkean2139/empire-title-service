import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Communication } from '../types/client';

interface Props {
  communications: Communication[];
  onAddCommunication: (communication: Omit<Communication, 'id'>) => void;
  onEditCommunication: (id: string, communication: Partial<Communication>) => void;
  onDeleteCommunication: (id: string) => void;
}

const communicationTypeIcons = {
  email: <EmailIcon />,
  call: <PhoneIcon />,
  meeting: <EventIcon />,
  note: <NoteIcon />,
};

const communicationTypeColors = {
  email: 'primary',
  call: 'success',
  meeting: 'warning',
  note: 'info',
};

export default function ClientCommunication({
  communications,
  onAddCommunication,
  onEditCommunication,
  onDeleteCommunication,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'email' as Communication['type'],
    subject: '',
    content: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    followUpDate: '',
    reminder: '',
  });

  const handleOpen = (communication?: Communication) => {
    if (communication) {
      setFormData({
        type: communication.type,
        subject: communication.subject,
        content: communication.content,
        date: format(new Date(communication.date), 'yyyy-MM-dd'),
        followUpDate: communication.followUpDate ? format(new Date(communication.followUpDate), 'yyyy-MM-dd') : '',
        reminder: communication.reminder ? format(new Date(communication.reminder), 'yyyy-MM-dd') : '',
      });
      setEditingId(communication.id);
    } else {
      setFormData({
        type: 'email',
        subject: '',
        content: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        followUpDate: '',
        reminder: '',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const communicationData = {
      type: formData.type,
      subject: formData.subject,
      content: formData.content,
      date: new Date(formData.date),
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
      reminder: formData.reminder ? new Date(formData.reminder) : undefined,
    };

    if (editingId) {
      onEditCommunication(editingId, communicationData);
    } else {
      onAddCommunication(communicationData);
    }
    handleClose();
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Communication History</Typography>
            <Button
              variant="contained"
              startIcon={<NoteIcon />}
              onClick={() => handleOpen()}
            >
              Add Communication
            </Button>
          </Box>

          <List>
            {communications.map((communication, index) => (
              <React.Fragment key={communication.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          icon={communicationTypeIcons[communication.type]}
                          label={communication.type}
                          size="small"
                          color={communicationTypeColors[communication.type] as any}
                        />
                        <Typography variant="subtitle1">{communication.subject}</Typography>
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {communication.content}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EventIcon fontSize="small" />
                            {format(new Date(communication.date), 'MMM d, yyyy')}
                          </Typography>
                          {communication.followUpDate && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon fontSize="small" />
                              Follow-up: {format(new Date(communication.followUpDate), 'MMM d, yyyy')}
                            </Typography>
                          )}
                          {communication.reminder && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <NotificationsIcon fontSize="small" />
                              Reminder: {format(new Date(communication.reminder), 'MMM d, yyyy')}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Edit">
                      <IconButton edge="end" onClick={() => handleOpen(communication)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton edge="end" onClick={() => onDeleteCommunication(communication.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Communication' : 'Add Communication'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Communication['type'] })}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <TextField
                fullWidth
                label="Content"
                multiline
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />

              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Follow-up Date"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Reminder"
                type="date"
                value={formData.reminder}
                onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Save Changes' : 'Add Communication'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
