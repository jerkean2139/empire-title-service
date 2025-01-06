import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useDroppable } from '@dnd-kit/core';
import { useEntityStore } from '../../stores/entityStore';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  activeId: string | null;
}

export function Calendar({ selectedDate, onDateSelect, activeId }: CalendarProps) {
  const theme = useTheme();
  const { tasks } = useEntityStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty days for padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotIndex = (hour - 9) * 2 + (minute === 30 ? 1 : 0);
        const time = new Date(selectedDate);
        time.setHours(hour, minute, 0, 0);

        const { setNodeRef, isOver } = useDroppable({
          id: String(slotIndex),
        });

        const tasksInSlot = tasks.filter(task => {
          if (!task.scheduledDate) return false;
          const taskDate = new Date(task.scheduledDate);
          return (
            taskDate.getFullYear() === time.getFullYear() &&
            taskDate.getMonth() === time.getMonth() &&
            taskDate.getDate() === time.getDate() &&
            taskDate.getHours() === time.getHours() &&
            taskDate.getMinutes() === time.getMinutes()
          );
        });

        slots.push(
          <Box
            key={slotIndex}
            ref={setNodeRef}
            sx={{
              p: 1,
              height: 60,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: isOver
                ? alpha(theme.palette.primary.main, 0.1)
                : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
            </Typography>
            {tasksInSlot.map(task => (
              <Box
                key={task.id}
                sx={{
                  mt: 0.5,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: task.id === activeId
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <Typography variant="body2" noWrap>
                  {task.title}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      }
    }
    return slots;
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Calendar Grid */}
      <Grid container spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid item xs key={day}>
            <Typography
              variant="subtitle2"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
        {getDaysInMonth(currentMonth).map((date, index) => (
          <Grid item xs key={index}>
            {date ? (
              <Box
                onClick={() => onDateSelect(date)}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: selectedDate && date.getTime() === selectedDate.getTime()
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color={
                    selectedDate && date.getTime() === selectedDate.getTime()
                      ? 'primary'
                      : 'text.primary'
                  }
                >
                  {date.getDate()}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 1 }} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Time Slots */}
      {selectedDate && (
        <Box
          sx={{
            mt: 2,
            maxHeight: 'calc(100vh - 400px)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: 4,
            },
          }}
        >
          {renderTimeSlots()}
        </Box>
      )}
    </Box>
  );
}
