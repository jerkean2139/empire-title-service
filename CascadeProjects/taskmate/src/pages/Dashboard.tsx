import { Container, Grid, Paper, Typography } from '@mui/material';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { Calendar } from '../components/dashboard/Calendar';
import { SpeedDialMenu } from '../components/dashboard/SpeedDialMenu';
import { PomodoroTimer } from '../components/pomodoro/PomodoroTimer';

export function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Dashboard */}
        <Grid item xs={12} lg={8}>
          <UserDashboard />
        </Grid>

        {/* Pomodoro Timer */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Pomodoro Timer
            </Typography>
            <PomodoroTimer />
          </Paper>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12}>
          <Calendar />
        </Grid>
      </Grid>

      {/* Speed Dial Menu */}
      <SpeedDialMenu />
    </Container>
  );
}
