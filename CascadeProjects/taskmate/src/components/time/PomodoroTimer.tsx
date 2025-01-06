import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Badge,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipNext as SkipIcon,
  Settings as SettingsIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  LocalCafe as CoffeeIcon,
  Whatshot as StreakIcon,
  Psychology as FocusIcon,
  TrendingUp as ProductivityIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'work' | 'shortBreak' | 'longBreak';
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
}

interface PomodoroStats {
  totalSessions: number;
  totalFocusTime: number;
  dailyStreak: number;
  weeklyGoalProgress: number;
  focusScore: number;
  rewards: number;
}

interface Props {
  currentTask?: Task;
  onSessionComplete: (session: PomodoroSession) => void;
  onEarnReward: (points: number) => void;
  stats: PomodoroStats;
}

export default function PomodoroTimer({
  currentTask,
  onSessionComplete,
  onEarnReward,
  stats,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: true,
    notifications: true,
  });
  const [sessionCount, setSessionCount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const calculateProgress = useCallback(() => {
    if (!currentSession) return 0;
    const total = currentSession.duration * 60;
    return ((total - timeLeft) / total) * 100;
  }, [currentSession, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning && !currentSession) {
      const session: PomodoroSession = {
        id: Date.now().toString(),
        taskId: currentTask?.id,
        startTime: new Date(),
        duration: settings.workDuration,
        type: 'work',
        completed: false,
      };
      setCurrentSession(session);
      setTimeLeft(settings.workDuration * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings.workDuration * 60);
    setCurrentSession(null);
  };

  const skipSession = () => {
    if (currentSession) {
      completeSession();
    }
  };

  const completeSession = () => {
    if (currentSession) {
      const completed = {
        ...currentSession,
        endTime: new Date(),
        completed: true,
      };
      onSessionComplete(completed);

      // Calculate rewards
      let points = 0;
      if (completed.type === 'work') {
        points = 10 + Math.floor(stats.dailyStreak / 5) * 2;
        setSessionCount(prev => prev + 1);
        
        if (sessionCount + 1 >= settings.sessionsUntilLongBreak) {
          setSessionCount(0);
          startBreak('long');
        } else {
          startBreak('short');
        }
      }

      if (points > 0) {
        setEarnedPoints(points);
        setShowReward(true);
        onEarnReward(points);
      }
    }
  };

  const startBreak = (type: 'short' | 'long') => {
    const duration = type === 'long' ? settings.longBreakDuration : settings.shortBreakDuration;
    const session: PomodoroSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: duration,
      type: type === 'long' ? 'longBreak' : 'shortBreak',
      completed: false,
    };
    setCurrentSession(session);
    setTimeLeft(duration * 60);
    if (settings.autoStartBreaks) {
      setIsRunning(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (currentSession) {
        completeSession();
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (settings.notifications) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  }, [settings.notifications]);

  const notifySessionComplete = () => {
    if (settings.notifications && Notification.permission === 'granted') {
      new Notification('Pomodoro Session Complete!', {
        body: currentSession?.type === 'work'
          ? 'Time for a break!'
          : 'Break time is over. Ready to focus?',
        icon: '/path/to/icon.png',
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Timer Display */}
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" color="text.secondary">
              {currentSession?.type === 'work' ? 'Focus Time' :
               currentSession?.type === 'shortBreak' ? 'Short Break' :
               currentSession?.type === 'longBreak' ? 'Long Break' :
               'Pomodoro Timer'}
            </Typography>

            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={calculateProgress()}
                size={200}
                thickness={4}
                sx={{
                  color: currentSession?.type === 'work' ? 'primary.main' :
                         currentSession?.type === 'shortBreak' ? 'success.main' :
                         'secondary.main'
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h2" component="div">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>

            {currentTask && (
              <Chip
                label={currentTask.title}
                color="primary"
                variant="outlined"
              />
            )}

            <Stack direction="row" spacing={2}>
              {!isRunning ? (
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={startTimer}
                >
                  Start
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PauseIcon />}
                  onClick={pauseTimer}
                >
                  Pause
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                onClick={stopTimer}
              >
                Stop
              </Button>
              <Button
                variant="outlined"
                startIcon={<SkipIcon />}
                onClick={skipSession}
              >
                Skip
              </Button>
              <IconButton onClick={() => setShowSettings(true)}>
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StreakIcon color="primary" />
                  <Typography variant="h6">
                    {stats.dailyStreak} Day Streak
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(stats.dailyStreak % 5) * 20}
                />
                <Typography variant="caption" color="text.secondary">
                  {5 - (stats.dailyStreak % 5)} days until bonus multiplier
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FocusIcon color="primary" />
                  <Typography variant="h6">
                    Focus Score: {stats.focusScore}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={stats.focusScore}
                  color="success"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrophyIcon color="primary" />
                  <Typography variant="h6">
                    {stats.rewards} Points
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Earn points for completed sessions
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Weekly Progress */}
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">Weekly Goal Progress</Typography>
              <LinearProgress
                variant="determinate"
                value={stats.weeklyGoalProgress}
                sx={{ height: 10, borderRadius: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {Math.round(stats.weeklyGoalProgress)}% of weekly focus time goal completed
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Timer Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Work Duration (minutes)"
              type="number"
              value={settings.workDuration}
              onChange={(e) => setSettings({
                ...settings,
                workDuration: parseInt(e.target.value),
              })}
            />
            <TextField
              label="Short Break Duration (minutes)"
              type="number"
              value={settings.shortBreakDuration}
              onChange={(e) => setSettings({
                ...settings,
                shortBreakDuration: parseInt(e.target.value),
              })}
            />
            <TextField
              label="Long Break Duration (minutes)"
              type="number"
              value={settings.longBreakDuration}
              onChange={(e) => setSettings({
                ...settings,
                longBreakDuration: parseInt(e.target.value),
              })}
            />
            <TextField
              label="Sessions Until Long Break"
              type="number"
              value={settings.sessionsUntilLongBreak}
              onChange={(e) => setSettings({
                ...settings,
                sessionsUntilLongBreak: parseInt(e.target.value),
              })}
            />
            <FormControl>
              <InputLabel>Auto-start Breaks</InputLabel>
              <Select
                value={settings.autoStartBreaks}
                label="Auto-start Breaks"
                onChange={(e) => setSettings({
                  ...settings,
                  autoStartBreaks: e.target.value === 'true',
                })}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Notifications</InputLabel>
              <Select
                value={settings.notifications}
                label="Notifications"
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: e.target.value === 'true',
                })}
              >
                <MenuItem value="true">Enabled</MenuItem>
                <MenuItem value="false">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowSettings(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reward Dialog */}
      <Dialog
        open={showReward}
        onClose={() => setShowReward(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            <TrophyIcon sx={{ fontSize: 60 }} color="primary" />
            <Typography variant="h5" align="center">
              Congratulations!
            </Typography>
            <Typography variant="body1" align="center">
              You've earned {earnedPoints} points for completing your focus session!
            </Typography>
            {stats.dailyStreak > 0 && (
              <Chip
                icon={<StreakIcon />}
                label={`${stats.dailyStreak} Day Streak Bonus!`}
                color="primary"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setShowReward(false)}>
            Awesome!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
