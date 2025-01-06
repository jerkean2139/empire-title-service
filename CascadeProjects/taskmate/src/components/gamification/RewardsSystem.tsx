import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Stars as RewardIcon,
  Whatshot as StreakIcon,
  Psychology as SkillIcon,
  Timeline as ProgressIcon,
  LocalAtm as BonusIcon,
  CardGiftcard as GiftIcon,
  WorkspacePremium as PremiumIcon,
  Leaderboard as LeaderboardIcon,
  Celebration as CelebrationIcon,
  Lock as LockIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: 'productivity' | 'teamwork' | 'quality' | 'learning';
  unlockedAt?: Date;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'bonus' | 'gift' | 'perk';
  points: number;
  icon: string;
  available: boolean;
  claimed: boolean;
  expiresAt?: Date;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  achievements: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  achievements: number;
  streak: number;
  rank: number;
  bonusMultiplier: number;
}

interface Props {
  achievements: Achievement[];
  rewards: Reward[];
  leaderboard: LeaderboardEntry[];
  userStats: UserStats;
  onClaimReward: (rewardId: string) => Promise<void>;
  onRedeemPoints: (points: number, rewardType: string) => Promise<void>;
}

export default function RewardsSystem({
  achievements,
  rewards,
  leaderboard,
  userStats,
  onClaimReward,
  onRedeemPoints,
}: Props) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);

  const calculateLevelProgress = () => {
    return (userStats.totalPoints / userStats.nextLevelPoints) * 100;
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <TrophyIcon />;
      case 'skill': return <SkillIcon />;
      case 'streak': return <StreakIcon />;
      case 'reward': return <RewardIcon />;
      default: return <TrophyIcon />;
    }
  };

  const handleClaimReward = async (reward: Reward) => {
    if (!reward.available || reward.claimed) return;
    
    setClaimingReward(true);
    try {
      await onClaimReward(reward.id);
      // Show success animation/notification
    } catch (error) {
      // Handle error
    } finally {
      setClaimingReward(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* User Stats Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.main',
                        border: '3px solid gold',
                      }}
                    >
                      <TrophyIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Stack>
                      <Typography variant="h5">
                        Level {userStats.level}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rank #{userStats.rank} • {userStats.achievements} Achievements
                      </Typography>
                    </Stack>
                  </Stack>
                  <Chip
                    icon={<StreakIcon />}
                    label={`${userStats.streak} Day Streak!`}
                    color="primary"
                  />
                </Stack>

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      Progress to Level {userStats.level + 1}
                    </Typography>
                    <Typography variant="body2">
                      {userStats.totalPoints} / {userStats.nextLevelPoints} XP
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={calculateLevelProgress()}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Stack>

                {userStats.bonusMultiplier > 1 && (
                  <Chip
                    icon={<BonusIcon />}
                    label={`${userStats.bonusMultiplier}x Point Multiplier Active!`}
                    color="secondary"
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Achievements
              </Typography>
              <Grid container spacing={2}>
                {achievements
                  .filter(a => a.completed)
                  .slice(0, 6)
                  .map(achievement => (
                    <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => setSelectedAchievement(achievement)}
                      >
                        <CardContent>
                          <Stack spacing={1} alignItems="center">
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Avatar sx={{ width: 22, height: 22, bgcolor: 'success.main' }}>
                                  <CompletedIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                              }
                            >
                              <Avatar
                                sx={{
                                  width: 56,
                                  height: 56,
                                  bgcolor: 'primary.main',
                                }}
                              >
                                {getAchievementIcon(achievement.icon)}
                              </Avatar>
                            </Badge>
                            <Typography variant="subtitle1" align="center">
                              {achievement.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={`+${achievement.points} XP`}
                              color="primary"
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Rewards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Available Rewards
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<GiftIcon />}
                  onClick={() => setShowRewards(true)}
                >
                  View All
                </Button>
              </Stack>
              <List>
                {rewards
                  .filter(r => r.available && !r.claimed)
                  .slice(0, 3)
                  .map(reward => (
                    <ListItem
                      key={reward.id}
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<GiftIcon />}
                          onClick={() => handleClaimReward(reward)}
                          disabled={claimingReward}
                        >
                          Claim
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {reward.type === 'bonus' ? <BonusIcon /> :
                           reward.type === 'gift' ? <GiftIcon /> :
                           <PremiumIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={reward.title}
                        secondary={`${reward.points} points required`}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Leaderboard Preview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Top Performers
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LeaderboardIcon />}
                  onClick={() => setShowLeaderboard(true)}
                >
                  Full Leaderboard
                </Button>
              </Stack>
              <Grid container spacing={2}>
                {leaderboard.slice(0, 3).map((entry, index) => (
                  <Grid item xs={12} sm={4} key={entry.userId}>
                    <Card
                      variant="outlined"
                      sx={{
                        bgcolor: index === 0 ? 'warning.light' :
                                index === 1 ? 'grey.200' :
                                index === 2 ? 'brown.light' : 'background.paper',
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2} alignItems="center">
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: index === 0 ? 'warning.main' :
                                          index === 1 ? 'grey.500' :
                                          'brown.main',
                                }}
                              >
                                {index + 1}
                              </Avatar>
                            }
                          >
                            <Avatar
                              src={entry.avatar}
                              sx={{ width: 64, height: 64 }}
                            >
                              {entry.name[0]}
                            </Avatar>
                          </Badge>
                          <Stack spacing={0.5} alignItems="center">
                            <Typography variant="h6">
                              {entry.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {entry.points} Points • {entry.achievements} Achievements
                            </Typography>
                            <Chip
                              icon={
                                entry.trend === 'up' ? <TrendingUpIcon /> :
                                entry.trend === 'down' ? <TrendingDownIcon /> :
                                <TrendingFlatIcon />
                              }
                              label={`Rank #${entry.rank}`}
                              color={
                                entry.trend === 'up' ? 'success' :
                                entry.trend === 'down' ? 'error' :
                                'default'
                              }
                              size="small"
                            />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Achievement Details Dialog */}
      <Dialog
        open={Boolean(selectedAchievement)}
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getAchievementIcon(selectedAchievement.icon)}
                </Avatar>
                <Typography variant="h6">
                  {selectedAchievement.title}
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Typography>
                  {selectedAchievement.description}
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={<RewardIcon />}
                    label={`${selectedAchievement.points} XP`}
                    color="primary"
                  />
                  <Chip
                    icon={<CategoryIcon />}
                    label={selectedAchievement.category}
                  />
                  {selectedAchievement.completed && (
                    <Chip
                      icon={<CompletedIcon />}
                      label={`Completed ${format(new Date(selectedAchievement.unlockedAt!), 'MMM d, yyyy')}`}
                      color="success"
                    />
                  )}
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAchievement(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Rewards Store Dialog */}
      <Dialog
        open={showRewards}
        onClose={() => setShowRewards(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Rewards Store
            </Typography>
            <Chip
              icon={<RewardIcon />}
              label={`${userStats.totalPoints} Points Available`}
              color="primary"
            />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {rewards.map(reward => (
              <Grid item xs={12} sm={6} md={4} key={reward.id}>
                <Card>
                  <CardContent>
                    <Stack spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: reward.type === 'bonus' ? 'success.main' :
                                   reward.type === 'gift' ? 'secondary.main' :
                                   'primary.main',
                        }}
                      >
                        {reward.type === 'bonus' ? <BonusIcon /> :
                         reward.type === 'gift' ? <GiftIcon /> :
                         <PremiumIcon />}
                      </Avatar>
                      <Typography variant="h6" align="center">
                        {reward.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {reward.description}
                      </Typography>
                      <Chip
                        label={`${reward.points} Points`}
                        color={reward.available ? 'primary' : 'default'}
                      />
                      {reward.expiresAt && (
                        <Typography variant="caption" color="error">
                          Expires {format(new Date(reward.expiresAt), 'MMM d, yyyy')}
                        </Typography>
                      )}
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={reward.claimed ? <CompletedIcon /> : <GiftIcon />}
                        onClick={() => handleClaimReward(reward)}
                        disabled={!reward.available || reward.claimed}
                      >
                        {reward.claimed ? 'Claimed' : 'Claim Reward'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Leaderboard Dialog */}
      <Dialog
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Team Leaderboard
            </Typography>
            <Chip
              icon={<LeaderboardIcon />}
              label={`Your Rank: #${userStats.rank}`}
              color="primary"
            />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <List>
            {leaderboard.map((entry, index) => (
              <ListItem key={entry.userId}>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: index === 0 ? 'warning.main' :
                                  index === 1 ? 'grey.500' :
                                  index === 2 ? 'brown.main' :
                                  'primary.main',
                          fontSize: '0.75rem',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                  >
                    <Avatar src={entry.avatar}>
                      {entry.name[0]}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={entry.name}
                  secondary={`${entry.points} Points • ${entry.achievements} Achievements`}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={
                      entry.trend === 'up' ? <TrendingUpIcon /> :
                      entry.trend === 'down' ? <TrendingDownIcon /> :
                      <TrendingFlatIcon />
                    }
                    label={`Rank #${entry.rank}`}
                    color={
                      entry.trend === 'up' ? 'success' :
                      entry.trend === 'down' ? 'error' :
                      'default'
                    }
                    size="small"
                  />
                </Stack>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
