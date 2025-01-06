import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Timeline,
  BarChart,
  PieChart,
  TrendingUp,
  People,
  Assessment,
  Schedule,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ClientAnalytics, Client, ClientLifecycleStage, ClientPriority, ProjectStatus } from '../types/client';
import { stringAvatar } from '../utils/avatarUtils';

interface Props {
  analytics: ClientAnalytics;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.main', mr: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>{value}</Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUp color={trend.value >= 0 ? 'success' : 'error'} />
          <Typography
            variant="body2"
            color={trend.value >= 0 ? 'success.main' : 'error.main'}
            sx={{ ml: 1 }}
          >
            {trend.value}% {trend.label}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const LifecycleDistribution: React.FC<{ data: { stage: ClientLifecycleStage; count: number }[] }> = ({ data }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Client Lifecycle Distribution</Typography>
      {data.map(({ stage, count }, index) => (
        <Box key={stage} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{stage}</Typography>
            <Typography variant="body2">{count}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(count / data.reduce((acc, curr) => acc + curr.count, 0)) * 100}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
      ))}
    </CardContent>
  </Card>
);

const ProjectStatusChart: React.FC<{ data: { status: ProjectStatus; count: number }[] }> = ({ data }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Project Status Distribution</Typography>
      {data.map(({ status, count }, index) => (
        <Box key={status} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{status.replace('_', ' ')}</Typography>
            <Typography variant="body2">{count}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(count / data.reduce((acc, curr) => acc + curr.count, 0)) * 100}
            sx={{
              height: 8,
              borderRadius: 1,
              '& .MuiLinearProgress-bar': {
                bgcolor: status === 'completed' ? 'success.main' :
                  status === 'in_progress' ? 'warning.main' :
                  status === 'on_hold' ? 'error.main' : 'info.main'
              }
            }}
          />
        </Box>
      ))}
    </CardContent>
  </Card>
);

const TopEngagedClients: React.FC<{ clients: Client[] }> = ({ clients }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Top Engaged Clients</Typography>
      <List>
        {clients.map((client, index) => (
          <React.Fragment key={client.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem>
              <ListItemAvatar>
                <Avatar {...stringAvatar(client.name)} />
              </ListItemAvatar>
              <ListItemText
                primary={client.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${client.engagementScore}% engaged`}
                      size="small"
                      color={
                        client.engagementScore >= 75 ? 'success' :
                        client.engagementScore >= 50 ? 'warning' : 'error'
                      }
                    />
                    {client.lastEngagement && (
                      <Typography variant="caption">
                        Last: {format(new Date(client.lastEngagement), 'MMM d')}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

const UpcomingFollowUps: React.FC<{ followUps: { client: Client; date: Date }[] }> = ({ followUps }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Follow-ups</Typography>
      <List>
        {followUps.map(({ client, date }, index) => (
          <React.Fragment key={client.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem>
              <ListItemAvatar>
                <Avatar {...stringAvatar(client.name)} />
              </ListItemAvatar>
              <ListItemText
                primary={client.name}
                secondary={format(new Date(date), 'MMM d, yyyy')}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default function ClientAnalyticsDashboard({ analytics }: Props) {
  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Key Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={analytics.totalClients}
            icon={<People sx={{ color: 'white' }} />}
            trend={{ value: 12, label: 'vs last month' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Clients"
            value={analytics.activeClients}
            icon={<Assessment sx={{ color: 'white' }} />}
            trend={{ value: 5, label: 'vs last month' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Engagement"
            value={`${analytics.averageEngagement}%`}
            icon={<Timeline sx={{ color: 'white' }} />}
            trend={{ value: 8, label: 'vs last month' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Churn Rate"
            value={`${analytics.churnRate}%`}
            icon={<BarChart sx={{ color: 'white' }} />}
            trend={{ value: -2, label: 'vs last month' }}
          />
        </Grid>

        {/* Charts and Distributions */}
        <Grid item xs={12} md={6}>
          <LifecycleDistribution data={analytics.clientsByLifecycle} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectStatusChart data={analytics.projectStatusDistribution} />
        </Grid>

        {/* Lists */}
        <Grid item xs={12} md={6}>
          <TopEngagedClients clients={analytics.topEngagedClients} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UpcomingFollowUps followUps={analytics.upcomingFollowUps} />
        </Grid>
      </Grid>
    </Box>
  );
}
