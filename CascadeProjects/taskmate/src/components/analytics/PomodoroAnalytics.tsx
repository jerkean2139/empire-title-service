import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  LinearProgress,
  CircularProgress,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Timer as TimerIcon,
  TrendingUp as TrendIcon,
  Psychology as FocusIcon,
  Whatshot as StreakIcon,
  Schedule as TimeIcon,
  Warning as DistractionIcon,
  CheckCircle as CompletedIcon,
  Cancel as IncompleteIcon,
  Star as StarIcon,
  Assessment as StatsIcon,
  Timeline as TimelineIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { aiAnalytics } from '../../services/AIAnalyticsService';

interface PomodoroStats {
  dailyFocusTime: number;
  completedPomodoros: number;
  successRate: number;
  averageFocusScore: number;
  streakDays: number;
  bestTimeOfDay: string;
  distractionPatterns: {
    timeRanges: string[];
    commonSources: string[];
  };
  improvements: string[];
}

interface Props {
  userId: string;
  onGenerateReport: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PomodoroAnalytics({ userId, onGenerateReport }: Props) {
  const [stats, setStats] = useState<PomodoroStats | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [showInsights, setShowInsights] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId, timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const dateRange: [Date, Date] = [
        timeRange === 'day' ? subDays(new Date(), 1) :
        timeRange === 'week' ? startOfWeek(new Date()) :
        subDays(new Date(), 30),
        new Date()
      ];

      const data = await aiAnalytics.analyzePomodoroEfficiency(userId, dateRange);
      setStats(data);
    } catch (error) {
      console.error('Error loading pomodoro stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewCards = () => (
    <Grid container spacing={3}>
      {/* Focus Time */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  Daily Focus Time
                </Typography>
                <TimerIcon color="primary" />
              </Stack>
              <Typography variant="h4">
                {Math.round(stats?.dailyFocusTime || 0)} min
              </Typography>
              <LinearProgress
                variant="determinate"
                value={((stats?.dailyFocusTime || 0) / 480) * 100}
                sx={{ height: 8, borderRadius: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Target: 480 minutes
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Success Rate */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  Success Rate
                </Typography>
                <TrendIcon color="primary" />
              </Stack>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={(stats?.successRate || 0) * 100}
                  size={80}
                  thickness={4}
                  sx={{ color: 'success.main' }}
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
                  <Typography variant="h6">
                    {Math.round((stats?.successRate || 0) * 100)}%
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  icon={<CompletedIcon />}
                  label={`${stats?.completedPomodoros || 0} Completed`}
                  color="success"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Focus Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  Focus Score
                </Typography>
                <FocusIcon color="primary" />
              </Stack>
              <Typography variant="h4">
                {Math.round((stats?.averageFocusScore || 0) * 100)}
              </Typography>
              <Stack direction="row" spacing={1}>
                {stats?.averageFocusScore && (
                  <Chip
                    size="small"
                    icon={<StarIcon />}
                    label={
                      stats.averageFocusScore >= 0.8 ? 'Excellent' :
                      stats.averageFocusScore >= 0.6 ? 'Good' :
                      'Needs Improvement'
                    }
                    color={
                      stats.averageFocusScore >= 0.8 ? 'success' :
                      stats.averageFocusScore >= 0.6 ? 'primary' :
                      'warning'
                    }
                  />
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Streak */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  Daily Streak
                </Typography>
                <StreakIcon color="primary" />
              </Stack>
              <Typography variant="h4">
                {stats?.streakDays || 0} days
              </Typography>
              <LinearProgress
                variant="determinate"
                value={((stats?.streakDays || 0) % 7) * (100 / 7)}
                sx={{ height: 8, borderRadius: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {7 - ((stats?.streakDays || 0) % 7)} days until bonus multiplier
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCharts = () => (
    <Grid container spacing={3}>
      {/* Focus Time Trend */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Focus Time Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={focusTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="focusTime"
                    stroke="#8884d8"
                    name="Focus Time (min)"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Productivity by Hour */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Best Focus Hours
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="score" fill="#8884d8" name="Focus Score" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Focus Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Focus Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={focusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {focusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    data={performanceMetrics}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderInsightsDialog = () => (
    <Dialog
      open={showInsights}
      onClose={() => setShowInsights(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <InsightsIcon color="primary" />
          <Typography variant="h6">
            Productivity Insights
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Best Performance */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Peak Performance Times
              </Typography>
              <Stack spacing={2}>
                <Typography>
                  Your most productive time is around {stats?.bestTimeOfDay}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule your most important tasks during these hours for optimal focus.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Distraction Patterns */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distraction Analysis
              </Typography>
              <List>
                {stats?.distractionPatterns.timeRanges.map((range, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <DistractionIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={range}
                      secondary={stats.distractionPatterns.commonSources[index]}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommended Improvements
              </Typography>
              <List>
                {stats?.improvements.map((improvement, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={improvement} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            Pomodoro Analytics
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<TimelineIcon />}
              onClick={() => setTimeRange('day')}
              color={timeRange === 'day' ? 'primary' : 'inherit'}
            >
              Day
            </Button>
            <Button
              variant="outlined"
              startIcon={<TimelineIcon />}
              onClick={() => setTimeRange('week')}
              color={timeRange === 'week' ? 'primary' : 'inherit'}
            >
              Week
            </Button>
            <Button
              variant="outlined"
              startIcon={<TimelineIcon />}
              onClick={() => setTimeRange('month')}
              color={timeRange === 'month' ? 'primary' : 'inherit'}
            >
              Month
            </Button>
            <Button
              variant="contained"
              startIcon={<InsightsIcon />}
              onClick={() => setShowInsights(true)}
            >
              View Insights
            </Button>
            <Button
              variant="contained"
              startIcon={<StatsIcon />}
              onClick={onGenerateReport}
            >
              Generate Report
            </Button>
          </Stack>
        </Stack>

        {renderOverviewCards()}
        {renderCharts()}
        {renderInsightsDialog()}
      </Stack>
    </Box>
  );
}
