import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Speed as VelocityIcon,
  TrendingUp as TrendingIcon,
  Assessment as MetricsIcon,
  BugReport as BugIcon,
  CheckCircle as CompletedIcon,
  Schedule as TimeIcon,
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
  Area,
  AreaChart,
} from 'recharts';
import { format, differenceInDays, addDays } from 'date-fns';

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  goals: string[];
  totalPoints: number;
  completedPoints: number;
  tasks: Array<{
    id: string;
    points: number;
    completed: boolean;
    completedAt?: Date;
  }>;
  velocity?: number;
  bugs: number;
  blockers: number;
}

interface SprintDay {
  date: Date;
  idealPoints: number;
  remainingPoints: number;
  completedPoints: number;
}

interface Props {
  sprint: Sprint;
  previousSprints: Sprint[];
}

export default function SprintMetrics({ sprint, previousSprints }: Props) {
  const generateBurndownData = (): SprintDay[] => {
    const days = differenceInDays(new Date(sprint.endDate), new Date(sprint.startDate)) + 1;
    const pointsPerDay = sprint.totalPoints / days;
    
    const data: SprintDay[] = [];
    let remainingPoints = sprint.totalPoints;
    
    for (let i = 0; i < days; i++) {
      const date = addDays(new Date(sprint.startDate), i);
      const completedToday = sprint.tasks
        .filter(t => t.completed && t.completedAt && format(new Date(t.completedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
        .reduce((sum, task) => sum + task.points, 0);
      
      remainingPoints -= completedToday;
      
      data.push({
        date,
        idealPoints: sprint.totalPoints - (pointsPerDay * i),
        remainingPoints: Math.max(0, remainingPoints),
        completedPoints: sprint.totalPoints - remainingPoints,
      });
    }
    
    return data;
  };

  const calculateVelocityTrend = () => {
    return previousSprints
      .slice(-5)
      .map(s => ({
        sprint: s.name,
        velocity: s.velocity || 0,
        completed: s.completedPoints,
        total: s.totalPoints,
      }));
  };

  const calculateSprintProgress = () => {
    const completed = sprint.completedPoints;
    const total = sprint.totalPoints;
    const percentage = (completed / total) * 100;
    
    return {
      percentage,
      completed,
      total,
      remaining: total - completed,
    };
  };

  const burndownData = generateBurndownData();
  const velocityData = calculateVelocityTrend();
  const progress = calculateSprintProgress();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Sprint Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Sprint Progress</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={<TimeIcon />}
                    label={`${differenceInDays(new Date(sprint.endDate), new Date())} days remaining`}
                    color="primary"
                  />
                  <Chip
                    icon={<BugIcon />}
                    label={`${sprint.bugs} bugs`}
                    color="error"
                  />
                  <Chip
                    icon={<CompletedIcon />}
                    label={`${progress.completed}/${progress.total} points`}
                    color="success"
                  />
                </Stack>
              </Stack>

              <LinearProgress
                variant="buffer"
                value={progress.percentage}
                valueBuffer={progress.percentage + 10}
                sx={{ height: 10, borderRadius: 1, mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                {progress.completed} of {progress.total} story points completed ({progress.percentage.toFixed(1)}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Burndown Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Burndown Chart
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <ChartTooltip
                      formatter={(value: number) => [`${value} points`, '']}
                      labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="idealPoints"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.1}
                      name="Ideal Burndown"
                    />
                    <Area
                      type="monotone"
                      dataKey="remainingPoints"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.1}
                      name="Actual Remaining"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Velocity Trend */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Velocity Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sprint" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="velocity"
                      stroke="#8884d8"
                      name="Velocity"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#82ca9d"
                      name="Completed Points"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sprint Goals */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sprint Goals
              </Typography>
              <Stack spacing={1}>
                {sprint.goals.map((goal, index) => (
                  <Chip
                    key={index}
                    label={goal}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sprint Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="primary">
                      Velocity
                    </Typography>
                    <Typography variant="h4">
                      {sprint.velocity?.toFixed(1) || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      points per sprint
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="error">
                      Bugs
                    </Typography>
                    <Typography variant="h4">
                      {sprint.bugs}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      reported issues
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="warning.main">
                      Blockers
                    </Typography>
                    <Typography variant="h4">
                      {sprint.blockers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      blocking issues
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="success.main">
                      Completion Rate
                    </Typography>
                    <Typography variant="h4">
                      {((progress.completed / progress.total) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of planned work
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
