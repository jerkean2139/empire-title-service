import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Button,
  Chip,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  EmojiEvents as QuestIcon,
  Group as TeamIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  TrendingUp as ProgressIcon,
  Celebration as CelebrationIcon,
  Psychology as StrategyIcon,
  WorkspacePremium as PremiumIcon,
  Casino as ChallengeIcon,
  LocalAtm as BonusIcon,
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  contribution: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  progress: number;
  maxProgress: number;
  rewards: {
    points: number;
    bonus?: string;
    achievement?: string;
  };
  teamMembers: TeamMember[];
  deadline?: Date;
  strategy?: string[];
  requirements: string[];
  status: 'active' | 'completed' | 'failed';
}

interface Props {
  quests: Quest[];
  onJoinQuest: (questId: string) => void;
  onCompleteTask: (questId: string, taskIndex: number) => void;
  onClaimReward: (questId: string) => void;
}

export default function TeamQuests({
  quests,
  onJoinQuest,
  onCompleteTask,
  onClaimReward,
}: Props) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestDialog, setShowQuestDialog] = useState(false);

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'info';
      case 'hard':
        return 'warning';
      case 'epic':
        return 'error';
    }
  };

  const getQuestProgress = (quest: Quest) => {
    return (quest.progress / quest.maxProgress) * 100;
  };

  const renderQuestCard = (quest: Quest) => (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        position: 'relative',
        overflow: 'visible',
      }}
      onClick={() => {
        setSelectedQuest(quest);
        setShowQuestDialog(true);
      }}
    >
      {quest.type === 'special' && (
        <Badge
          sx={{
            position: 'absolute',
            top: -12,
            right: -12,
          }}
          badgeContent={
            <Avatar sx={{ bgcolor: 'error.main', width: 24, height: 24 }}>
              <StarIcon sx={{ fontSize: 16 }} />
            </Avatar>
          }
        >
          <Box />
        </Badge>
      )}
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {quest.title}
            </Typography>
            <Chip
              size="small"
              label={quest.difficulty.toUpperCase()}
              color={getDifficultyColor(quest.difficulty)}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {quest.description}
          </Typography>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">
                Progress
              </Typography>
              <Typography variant="body2">
                {quest.progress}/{quest.maxProgress}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={getQuestProgress(quest)}
              sx={{
                height: 8,
                borderRadius: 1,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              icon={<StarIcon />}
              label={`${quest.rewards.points} Points`}
              color="primary"
            />
            {quest.rewards.bonus && (
              <Chip
                size="small"
                icon={<BonusIcon />}
                label={quest.rewards.bonus}
                color="secondary"
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <AvatarGroup max={4}>
              {quest.teamMembers.map(member => (
                <Tooltip key={member.id} title={member.name}>
                  <Avatar src={member.avatar}>
                    {member.name[0]}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            {quest.deadline && (
              <Chip
                size="small"
                icon={<TimerIcon />}
                label={format(new Date(quest.deadline), 'MMM d, h:mm a')}
                color={
                  new Date(quest.deadline).getTime() - Date.now() < 86400000
                    ? 'error'
                    : 'default'
                }
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderQuestDialog = () => (
    <Dialog
      open={showQuestDialog}
      onClose={() => setShowQuestDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedQuest && (
        <>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: getDifficultyColor(selectedQuest.difficulty).main,
                  }}
                >
                  <QuestIcon />
                </Avatar>
                <Typography variant="h6">
                  {selectedQuest.title}
                </Typography>
              </Stack>
              <Chip
                label={selectedQuest.type.toUpperCase()}
                color="primary"
              />
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Typography>
                {selectedQuest.description}
              </Typography>

              {/* Progress Section */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      Quest Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getQuestProgress(selectedQuest)}
                      sx={{ height: 10, borderRadius: 1 }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Stack alignItems="center">
                          <Typography variant="h4">
                            {selectedQuest.progress}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Completed Tasks
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack alignItems="center">
                          <Typography variant="h4">
                            {selectedQuest.maxProgress - selectedQuest.progress}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Remaining Tasks
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack alignItems="center">
                          <Typography variant="h4">
                            {selectedQuest.teamMembers.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Team Members
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Team Members
                  </Typography>
                  <List>
                    {selectedQuest.teamMembers.map(member => (
                      <ListItem key={member.id}>
                        <ListItemAvatar>
                          <Avatar src={member.avatar}>
                            {member.name[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={member.role}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">
                            Contribution:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={member.contribution}
                            sx={{ width: 100 }}
                          />
                          <Typography variant="body2">
                            {member.contribution}%
                          </Typography>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Strategy */}
              {selectedQuest.strategy && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quest Strategy
                    </Typography>
                    <List>
                      {selectedQuest.strategy.map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <StrategyIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <List>
                    {selectedQuest.requirements.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon
                            color={index < selectedQuest.progress ? 'success' : 'disabled'}
                          />
                        </ListItemIcon>
                        <ListItemText primary={req} />
                        {index < selectedQuest.progress ? (
                          <Chip
                            size="small"
                            label="Completed"
                            color="success"
                          />
                        ) : (
                          <Button
                            size="small"
                            onClick={() => onCompleteTask(selectedQuest.id, index)}
                          >
                            Complete
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Rewards
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      icon={<StarIcon />}
                      label={`${selectedQuest.rewards.points} Points`}
                      color="primary"
                    />
                    {selectedQuest.rewards.bonus && (
                      <Chip
                        icon={<BonusIcon />}
                        label={selectedQuest.rewards.bonus}
                        color="secondary"
                      />
                    )}
                    {selectedQuest.rewards.achievement && (
                      <Chip
                        icon={<PremiumIcon />}
                        label={selectedQuest.rewards.achievement}
                        color="warning"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowQuestDialog(false)}>
              Close
            </Button>
            {selectedQuest.status === 'active' ? (
              <Button
                variant="contained"
                onClick={() => onJoinQuest(selectedQuest.id)}
                startIcon={<TeamIcon />}
              >
                Join Quest
              </Button>
            ) : selectedQuest.status === 'completed' ? (
              <Button
                variant="contained"
                color="success"
                onClick={() => onClaimReward(selectedQuest.id)}
                startIcon={<CelebrationIcon />}
              >
                Claim Rewards
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                disabled
                startIcon={<BlockIcon />}
              >
                Quest Failed
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Active Quests */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Active Team Quests
          </Typography>
          <Grid container spacing={2}>
            {quests
              .filter(q => q.status === 'active')
              .map(quest => (
                <Grid item xs={12} sm={6} md={4} key={quest.id}>
                  {renderQuestCard(quest)}
                </Grid>
              ))}
          </Grid>
        </Grid>

        {/* Completed Quests */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Completed Quests
          </Typography>
          <Grid container spacing={2}>
            {quests
              .filter(q => q.status === 'completed')
              .map(quest => (
                <Grid item xs={12} sm={6} md={4} key={quest.id}>
                  {renderQuestCard(quest)}
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      {renderQuestDialog()}
    </Box>
  );
}
