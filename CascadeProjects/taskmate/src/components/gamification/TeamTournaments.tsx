import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Stars as LeaderIcon,
  Timeline as ProgressIcon,
  Group as TeamIcon,
  Whatshot as HotstreakIcon,
  WorkspacePremium as PremiumIcon,
  LocalFireDepartment as ChallengeIcon,
  Casino as BonusIcon,
  Celebration as CelebrationIcon,
  Psychology as StrategyIcon,
} from '@mui/icons-material';

interface Tournament {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'productivity' | 'collaboration' | 'innovation' | 'quality';
  status: 'upcoming' | 'active' | 'completed';
  teams: Team[];
  prizes: Prize[];
  challenges: Challenge[];
  leaderboard: TeamScore[];
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  score: number;
  rank: number;
  achievements: Achievement[];
  currentStreak: number;
  bonusMultiplier: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  contribution: number;
  specializations: string[];
}

interface Prize {
  rank: number;
  rewards: {
    points: number;
    badges: string[];
    bonuses: string[];
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  points: number;
  progress: number;
  requirements: string[];
  bonusConditions?: string[];
}

interface TeamScore {
  teamId: string;
  score: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Props {
  tournaments: Tournament[];
  currentTeamId: string;
  onJoinTournament: (tournamentId: string) => void;
  onViewDetails: (tournamentId: string) => void;
  onClaimRewards: (tournamentId: string, rewards: any) => void;
}

export default function TeamTournaments({
  tournaments,
  currentTeamId,
  onJoinTournament,
  onViewDetails,
  onClaimRewards,
}: Props) {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
    }
  };

  const getTournamentProgress = (tournament: Tournament) => {
    const total = new Date(tournament.endDate).getTime() - new Date(tournament.startDate).getTime();
    const elapsed = Date.now() - new Date(tournament.startDate).getTime();
    return Math.min(100, (elapsed / total) * 100);
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        position: 'relative',
      }}
      onClick={() => {
        setSelectedTournament(tournament);
        setShowDetailsDialog(true);
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {tournament.title}
            </Typography>
            <Chip
              size="small"
              label={tournament.status.toUpperCase()}
              color={getStatusColor(tournament.status)}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {tournament.description}
          </Typography>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">
                Progress
              </Typography>
              <Typography variant="body2">
                {Math.round(getTournamentProgress(tournament))}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={getTournamentProgress(tournament)}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              icon={<TeamIcon />}
              label={`${tournament.teams.length} Teams`}
              color="primary"
            />
            <Chip
              size="small"
              icon={<ChallengeIcon />}
              label={`${tournament.challenges.length} Challenges`}
              color="secondary"
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <AvatarGroup max={4}>
              {tournament.teams.map(team => (
                <Tooltip key={team.id} title={team.name}>
                  <Avatar>
                    {team.name[0]}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            {tournament.status === 'active' && (
              <Button
                variant="contained"
                startIcon={<TeamIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinTournament(tournament.id);
                }}
              >
                Join Tournament
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderDetailsDialog = () => (
    <Dialog
      open={showDetailsDialog}
      onClose={() => setShowDetailsDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedTournament && (
        <>
          <DialogTitle>
            <Stack direction="row" spacing={2} alignItems="center">
              <TrophyIcon color="primary" />
              <Typography variant="h6">
                {selectedTournament.title}
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              {/* Overview */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tournament Overview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography>
                          <strong>Start Date:</strong>{' '}
                          {new Date(selectedTournament.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          <strong>End Date:</strong>{' '}
                          {new Date(selectedTournament.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          <strong>Type:</strong> {selectedTournament.type}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography>
                          <strong>Teams:</strong> {selectedTournament.teams.length}
                        </Typography>
                        <Typography>
                          <strong>Challenges:</strong>{' '}
                          {selectedTournament.challenges.length}
                        </Typography>
                        <Typography>
                          <strong>Status:</strong> {selectedTournament.status}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tournament Leaderboard
                  </Typography>
                  <List>
                    {selectedTournament.leaderboard.map((team, index) => (
                      <ListItem
                        key={team.teamId}
                        secondaryAction={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6">
                              {team.score}
                            </Typography>
                            <Chip
                              size="small"
                              icon={
                                team.trend === 'up' ? <TrendingUpIcon /> :
                                team.trend === 'down' ? <TrendingDownIcon /> :
                                <TrendingFlatIcon />
                              }
                              label={team.trend}
                              color={
                                team.trend === 'up' ? 'success' :
                                team.trend === 'down' ? 'error' :
                                'default'
                              }
                            />
                          </Stack>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                index === 0 ? 'warning.main' :
                                index === 1 ? 'grey.400' :
                                index === 2 ? 'brown.400' :
                                'grey.200'
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            selectedTournament.teams.find(t => t.id === team.teamId)?.name
                          }
                          secondary={`Rank #${team.rank}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Prizes */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tournament Prizes
                  </Typography>
                  <List>
                    {selectedTournament.prizes.map((prize) => (
                      <ListItem
                        key={prize.rank}
                        secondaryAction={
                          <Stack direction="row" spacing={1}>
                            {prize.rewards.badges.map((badge, index) => (
                              <Tooltip key={index} title={badge}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: 'primary.main'
                                  }}
                                >
                                  <StarIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                              </Tooltip>
                            ))}
                          </Stack>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                prize.rank === 1 ? 'warning.main' :
                                prize.rank === 2 ? 'grey.400' :
                                prize.rank === 3 ? 'brown.400' :
                                'grey.200'
                            }}
                          >
                            {prize.rank}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${prize.rewards.points} Points`}
                          secondary={prize.rewards.bonuses.join(', ')}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Active Challenges */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Challenges
                  </Typography>
                  <List>
                    {selectedTournament.challenges.map((challenge) => (
                      <ListItem
                        key={challenge.id}
                        secondaryAction={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LinearProgress
                              variant="determinate"
                              value={challenge.progress}
                              sx={{ width: 100 }}
                            />
                            <Typography variant="body2">
                              {challenge.progress}%
                            </Typography>
                          </Stack>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <ChallengeIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={challenge.title}
                          secondary={
                            <>
                              {challenge.description}
                              <br />
                              <Chip
                                size="small"
                                icon={<StarIcon />}
                                label={`${challenge.points} Points`}
                                color="primary"
                                sx={{ mt: 1 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            Team Tournaments
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => {/* Add filter logic */}}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Add create tournament logic */}}
            >
              Create Tournament
            </Button>
          </Stack>
        </Stack>

        {/* Tournament Grid */}
        <Grid container spacing={3}>
          {tournaments.map(tournament => (
            <Grid item xs={12} sm={6} md={4} key={tournament.id}>
              {renderTournamentCard(tournament)}
            </Grid>
          ))}
        </Grid>

        {renderDetailsDialog()}
      </Stack>
    </Box>
  );
}
