import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { Grid, Box, Paper, useTheme } from '@mui/material';
import { ClientsWidget } from './widgets/ClientsWidget';
import { ProjectsWidget } from './widgets/ProjectsWidget';
import { TopTasksWidget } from './widgets/TopTasksWidget';
import { Calendar } from './Calendar';
import { ChatConsole } from './ChatConsole';
import { AIAssistant } from './AIAssistant';
import { GoogleCalendarAuth } from '../auth/GoogleCalendarAuth';
import { useEntityStore } from '../../stores/entityStore';

export function Dashboard() {
  const theme = useTheme();
  const { tasks, updateTask } = useEntityStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !selectedDate) return;

    const taskId = active.id as string;
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      // Calculate the time slot based on drop position
      const dropIndex = Number(over.id);
      const hour = Math.floor(dropIndex / 2);
      const minute = (dropIndex % 2) * 30;
      const newDate = new Date(selectedDate);
      newDate.setHours(hour, minute, 0, 0);

      updateTask({
        ...task,
        scheduledDate: newDate,
        duration: 30 // 30-minute pomodoro
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        bgcolor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        {/* Google Calendar Auth */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <GoogleCalendarAuth />
        </Box>

        <Grid container spacing={3}>
          {/* Top Row - Widgets */}
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ClientsWidget />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ProjectsWidget />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <TopTasksWidget />
            </Paper>
          </Grid>

          {/* Middle Row - Calendar */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Calendar 
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
                activeId={activeId}
              />
            </Paper>
          </Grid>

          {/* Chat Console */}
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ChatConsole />
            </Paper>
          </Grid>
        </Grid>

        {/* AI Assistant */}
        <AIAssistant />

        <DragOverlay>
          {activeId ? (
            <Paper
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: 1,
                width: 200,
              }}
            >
              {tasks.find(t => t.id === activeId)?.title}
            </Paper>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}
