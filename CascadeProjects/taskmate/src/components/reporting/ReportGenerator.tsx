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
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Report, ReportSection, Company, TeamMember } from '../../types/client';

interface Props {
  reports: Report[];
  companies: Company[];
  teamMembers: TeamMember[];
  onCreateReport: (report: Omit<Report, 'id'>) => void;
  onEditReport: (id: string, report: Partial<Report>) => void;
  onDeleteReport: (id: string) => void;
  onGenerateReport: (id: string) => void;
  onPreviewReport: (id: string) => void;
  onScheduleReport: (id: string, schedule: Report['frequency']) => void;
  onEmailReport: (id: string, recipients: string[]) => void;
}

export default function ReportGenerator({
  reports,
  companies,
  teamMembers,
  onCreateReport,
  onEditReport,
  onDeleteReport,
  onGenerateReport,
  onPreviewReport,
  onScheduleReport,
  onEmailReport,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'company' as Report['type'],
    format: 'pdf' as Report['format'],
    frequency: undefined as Report['frequency'],
    recipients: [] as string[],
    template: {
      sections: [] as ReportSection[],
      styling: {},
    },
    filters: {},
  });

  const handleOpen = (report?: Report) => {
    if (report) {
      setFormData({
        name: report.name,
        type: report.type,
        format: report.format,
        frequency: report.frequency,
        recipients: report.recipients,
        template: report.template,
        filters: report.filters || {},
      });
      setEditingId(report.id);
    } else {
      setFormData({
        name: '',
        type: 'company',
        format: 'pdf',
        frequency: undefined,
        recipients: [],
        template: {
          sections: [],
          styling: {},
        },
        filters: {},
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditReport(editingId, formData);
    } else {
      onCreateReport(formData);
    }
    setOpen(false);
  };

  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        sections: [
          ...prev.template.sections,
          {
            type: 'summary',
            title: 'New Section',
            data: null,
            options: {},
          },
        ],
      },
    }));
  };

  const handleDeleteSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      template: {
        ...prev.template,
        sections: prev.template.sections.filter((_, i) => i !== index),
      },
    }));
  };

  const handleScheduleReport = (frequency: Report['frequency']) => {
    if (selectedReport) {
      onScheduleReport(selectedReport, frequency);
      setScheduleDialogOpen(false);
      setSelectedReport(null);
    }
  };

  const handleEmailReport = (recipients: string[]) => {
    if (selectedReport) {
      onEmailReport(selectedReport, recipients);
      setEmailDialogOpen(false);
      setSelectedReport(null);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Report Templates</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Create Report
            </Button>
          </Box>

          <List>
            {reports.map(report => (
              <ListItem
                key={report.id}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">{report.name}</Typography>
                      <Chip label={report.type} size="small" />
                      <Chip label={report.format.toUpperCase()} size="small" />
                      {report.frequency && (
                        <Chip
                          icon={<ScheduleIcon />}
                          label={report.frequency}
                          size="small"
                          color="primary"
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        Sections: {report.template.sections.length}
                      </Typography>
                      {report.lastGenerated && (
                        <Typography variant="caption">
                          Last Generated: {format(new Date(report.lastGenerated), 'MMM d, yyyy')}
                        </Typography>
                      )}
                      {report.nextGeneration && (
                        <Typography variant="caption">
                          Next Generation: {format(new Date(report.nextGeneration), 'MMM d, yyyy')}
                        </Typography>
                      )}
                    </Stack>
                  }
                />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => {
                        setSelectedReport(report.id);
                        setEmailDialogOpen(true);
                      }}
                    >
                      <EmailIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedReport(report.id);
                        setScheduleDialogOpen(true);
                      }}
                    >
                      <ScheduleIcon />
                    </IconButton>
                    <IconButton onClick={() => onPreviewReport(report.id)}>
                      <PreviewIcon />
                    </IconButton>
                    <IconButton onClick={() => onGenerateReport(report.id)}>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpen(report)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteReport(report.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Report Editor Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Report' : 'Create Report'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Report Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Type"
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Report['type'] })}
                    >
                      <MenuItem value="company">Company</MenuItem>
                      <MenuItem value="project">Project</MenuItem>
                      <MenuItem value="communication">Communication</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={formData.format}
                      label="Format"
                      onChange={(e) => setFormData({ ...formData, format: e.target.value as Report['format'] })}
                    >
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="excel">Excel</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Schedule</InputLabel>
                    <Select
                      value={formData.frequency || ''}
                      label="Schedule"
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Report['frequency'] })}
                    >
                      <MenuItem value="">No Schedule</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Autocomplete
                multiple
                options={teamMembers}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={teamMembers.filter(member => formData.recipients.includes(member.id))}
                onChange={(_, newValue) => setFormData({
                  ...formData,
                  recipients: newValue.map(member => member.id),
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recipients"
                    placeholder="Add recipients..."
                  />
                )}
              />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Report Sections
                </Typography>
                <List>
                  {formData.template.sections.map((section, index) => (
                    <ListItem
                      key={index}
                      sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
                    >
                      <ListItemText
                        primary={section.title}
                        secondary={section.type}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => handleDeleteSection(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddSection}
                  sx={{ mt: 1 }}
                >
                  Add Section
                </Button>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Save Changes' : 'Create Report'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => {
          setScheduleDialogOpen(false);
          setSelectedReport(null);
        }}
      >
        <DialogTitle>Schedule Report</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Frequency</InputLabel>
            <Select
              value={reports.find(r => r.id === selectedReport)?.frequency || ''}
              label="Frequency"
              onChange={(e) => handleScheduleReport(e.target.value as Report['frequency'])}
            >
              <MenuItem value="">No Schedule</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => {
          setEmailDialogOpen(false);
          setSelectedReport(null);
        }}
      >
        <DialogTitle>Email Report</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={teamMembers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            defaultValue={teamMembers.filter(
              member => reports.find(r => r.id === selectedReport)?.recipients.includes(member.id)
            )}
            onChange={(_, newValue) => handleEmailReport(newValue.map(member => member.id))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Recipients"
                placeholder="Add recipients..."
                sx={{ mt: 2 }}
              />
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
