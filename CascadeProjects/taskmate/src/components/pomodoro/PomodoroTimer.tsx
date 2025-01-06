import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { useEntityStore } from '../../stores/entityStore';

export interface PomodoroTimerProps {
  onClose?: () => void;
}

export function PomodoroTimer({ onClose }: PomodoroTimerProps) {
  const {
    isRunning,
    timeLeft,
    currentSession,
    completedPomodoros,
    selectedTaskId,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    setSelectedTask,
  } = usePomodoroStore();

  const { tasks } = useEntityStore();

  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const handleTimerComplete = () => {
    if (currentSession === 'work') {
      setIsBreak(true);
    } else {
      setIsBreak(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = currentSession === 'work' ? 25 * 60 : 5 * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Pomodoro Timer
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            {formatTime(timeLeft)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{ mb: 2, height: 8, borderRadius: 4 }}
          />
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {currentSession === 'work' ? 'Work Session' : 'Break Time'} •{' '}
            {completedPomodoros} Pomodoros Completed
          </Typography>

          <Box sx={{ mb: 3 }}>
            <IconButton
              onClick={isRunning ? pauseTimer : startTimer}
              color="primary"
              size="large"
            >
              {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={resetTimer} color="primary" size="large">
              <RestartAltIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Task</InputLabel>
            <Select
              value={selectedTaskId || ''}
              onChange={(e) => setSelectedTask(e.target.value)}
              label="Select Task"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            fullWidth
          >
            Done
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
