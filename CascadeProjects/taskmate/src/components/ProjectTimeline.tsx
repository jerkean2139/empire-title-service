import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Today as TodayIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import {
  format,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  addDays,
  isSameMonth,
} from 'date-fns';
import { Project, ProjectTask } from '../types/client';

interface Props {
  projects: Project[];
}

type TimelineView = 'month' | '3months' | '6months' | 'year';
type TimelineItem = {
  date: Date;
  type: 'project_start' | 'project_end' | 'task';
  project: Project;
  task?: ProjectTask;
};

const statusColors = {
  planned: '#2196f3',
  in_progress: '#ff9800',
  completed: '#4caf50',
  on_hold: '#f44336',
};

const taskStatusColors = {
  todo: '#f44336',
  in_progress: '#ff9800',
  completed: '#4caf50',
};

export default function ProjectTimeline({ projects }: Props) {
  const [view, setView] = useState<TimelineView>('3months');
  const [centerDate, setCenterDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getTimelineRange = () => {
    switch (view) {
      case 'month':
        return { start: startOfMonth(centerDate), end: endOfMonth(centerDate) };
      case '3months':
        return {
          start: startOfMonth(subMonths(centerDate, 1)),
          end: endOfMonth(addMonths(centerDate, 1)),
        };
      case '6months':
        return {
          start: startOfMonth(subMonths(centerDate, 2)),
          end: endOfMonth(addMonths(centerDate, 3)),
        };
      case 'year':
        return {
          start: startOfMonth(subMonths(centerDate, 5)),
          end: endOfMonth(addMonths(centerDate, 6)),
        };
    }
  };

  const getTimelineItems = (): TimelineItem[] => {
    const range = getTimelineRange();
    const items: TimelineItem[] = [];

    projects
      .filter(project => {
        if (filterStatus.length > 0 && !filterStatus.includes(project.status)) {
          return false;
        }
        if (searchTerm) {
          return project.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      })
      .forEach(project => {
        // Add project start
        if (isWithinInterval(new Date(project.startDate), range)) {
          items.push({
            date: new Date(project.startDate),
            type: 'project_start',
            project,
          });
        }

        // Add project end
        if (project.endDate && isWithinInterval(new Date(project.endDate), range)) {
          items.push({
            date: new Date(project.endDate),
            type: 'project_end',
            project,
          });
        }

        // Add tasks
        project.tasks.forEach(task => {
          if (task.dueDate && isWithinInterval(new Date(task.dueDate), range)) {
            items.push({
              date: new Date(task.dueDate),
              type: 'task',
              project,
              task,
            });
          }
        });
      });

    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const renderTimelineContent = (item: TimelineItem) => {
    switch (item.type) {
      case 'project_start':
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {item.project.name} Started
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label={item.project.status}
                size="small"
                sx={{ bgcolor: statusColors[item.project.status] }}
              />
              <Chip
                label={`${item.project.completionPercentage}% complete`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        );
      case 'project_end':
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {item.project.name} Due
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {differenceInDays(new Date(item.project.endDate!), new Date(item.project.startDate))} days
            </Typography>
          </Box>
        );
      case 'task':
        return (
          <Box>
            <Typography variant="body1">
              {item.project.name} - {item.task!.name}
            </Typography>
            <Chip
              label={item.task!.status}
              size="small"
              sx={{ mt: 1, bgcolor: taskStatusColors[item.task!.status] }}
            />
          </Box>
        );
    }
  };

  const handleZoomIn = () => {
    const views: TimelineView[] = ['month', '3months', '6months', 'year'];
    const currentIndex = views.indexOf(view);
    if (currentIndex > 0) {
      setView(views[currentIndex - 1]);
    }
  };

  const handleZoomOut = () => {
    const views: TimelineView[] = ['month', '3months', '6months', 'year'];
    const currentIndex = views.indexOf(view);
    if (currentIndex < views.length - 1) {
      setView(views[currentIndex + 1]);
    }
  };

  const timelineItems = getTimelineItems();
  const range = getTimelineRange();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Project Timeline</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value as string[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="planned">Planned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Previous">
                <IconButton onClick={() => setCenterDate(subMonths(centerDate, 1))}>
                  <DateRangeIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                onClick={() => setCenterDate(new Date())}
                startIcon={<TodayIcon />}
              >
                Today
              </Button>
              <Tooltip title="Next">
                <IconButton onClick={() => setCenterDate(addMonths(centerDate, 1))}>
                  <DateRangeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn} disabled={view === 'month'}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomOut} disabled={view === 'year'}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        <Timeline position="alternate">
          {timelineItems.map((item, index) => (
            <TimelineItem key={`${item.type}-${item.project.id}-${item.task?.id || ''}`}>
              <TimelineOppositeContent>
                <Typography variant="body2" color="text.secondary">
                  {format(item.date, 'MMM d, yyyy')}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: item.type === 'task'
                      ? taskStatusColors[item.task!.status]
                      : statusColors[item.project.status],
                  }}
                />
                {index < timelineItems.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                {renderTimelineContent(item)}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
