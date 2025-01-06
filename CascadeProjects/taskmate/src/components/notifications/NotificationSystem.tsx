import React, { useState, useEffect } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Stack,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Badge,
  Slide,
  Grow,
  Chip,
  Menu,
  MenuItem,
  Drawer,
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  EmojiEvents as AchievementIcon,
  Celebration as CelebrationIcon,
  Star as StarIcon,
  Timeline as MilestoneIcon,
  Group as TeamIcon,
  TrendingUp as TrendingIcon,
  Warning as AlertIcon,
  CheckCircle as CompletedIcon,
  Psychology as InsightIcon,
  Whatshot as HotstreakIcon,
  LocalAtm as BonusIcon,
  CardGiftcard as GiftIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import Confetti from 'react-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'achievement' | 'milestone' | 'streak' | 'bonus';
  points: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Notification {
  id: string;
  type: 'achievement' | 'milestone' | 'alert' | 'insight' | 'team' | 'reward';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    handler: () => void;
  };
  metadata?: {
    points?: number;
    achievement?: Achievement;
    teamMembers?: string[];
    metrics?: Record<string, number>;
  };
}

interface Props {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationAction: (id: string, action: string) => void;
  onClearAll: () => void;
}

const SlideTransition = React.forwardRef((
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotificationSystem({
  notifications,
  onNotificationRead,
  onNotificationAction,
  onClearAll,
}: Props) {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      const achievementNotification = unreadNotifications.find(
        n => n.type === 'achievement'
      );
      
      if (achievementNotification) {
        setCurrentNotification(achievementNotification);
        setShowAchievement(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setCurrentNotification(unreadNotifications[0]);
        setShowNotification(true);
      }
    }
  }, [notifications]);

  const handleClose = (id: string) => {
    setShowNotification(false);
    setShowAchievement(false);
    onNotificationRead(id);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <AchievementIcon />;
      case 'milestone':
        return <MilestoneIcon />;
      case 'alert':
        return <AlertIcon />;
      case 'insight':
        return <InsightIcon />;
      case 'team':
        return <TeamIcon />;
      case 'reward':
        return <GiftIcon />;
      default:
        return <NotificationIcon />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'success';
      case 'milestone':
        return 'primary';
      case 'alert':
        return 'error';
      case 'insight':
        return 'info';
      case 'team':
        return 'secondary';
      case 'reward':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderAchievementDialog = () => (
    <Dialog
      open={showAchievement}
      onClose={() => handleClose(currentNotification?.id || '')}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Grow}
    >
      {showConfetti && <Confetti />}
      {currentNotification?.metadata?.achievement && (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Stack spacing={2} alignItems="center">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar sx={{ width: 22, height: 22, bgcolor: 'success.main' }}>
                    <StarIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                }
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    mb: 1,
                  }}
                >
                  <CelebrationIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Badge>
              <Typography variant="h5">
                Achievement Unlocked!
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} alignItems="center" sx={{ py: 2 }}>
              <Typography variant="h6">
                {currentNotification.metadata.achievement.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {currentNotification.metadata.achievement.description}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<StarIcon />}
                  label={`${currentNotification.metadata.achievement.points} Points`}
                  color="primary"
                />
                <Chip
                  icon={
                    currentNotification.metadata.achievement.rarity === 'legendary' ? <HotstreakIcon /> :
                    currentNotification.metadata.achievement.rarity === 'epic' ? <StarIcon /> :
                    currentNotification.metadata.achievement.rarity === 'rare' ? <TrendingIcon /> :
                    <CheckCircle />
                  }
                  label={currentNotification.metadata.achievement.rarity.toUpperCase()}
                  color={
                    currentNotification.metadata.achievement.rarity === 'legendary' ? 'error' :
                    currentNotification.metadata.achievement.rarity === 'epic' ? 'warning' :
                    currentNotification.metadata.achievement.rarity === 'rare' ? 'info' :
                    'default'
                  }
                />
              </Stack>
              {currentNotification.action && (
                <Button
                  variant="contained"
                  onClick={() => {
                    onNotificationAction(currentNotification.id, currentNotification.action!.label);
                    handleClose(currentNotification.id);
                  }}
                >
                  {currentNotification.action.label}
                </Button>
              )}
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );

  const renderNotificationDrawer = () => (
    <Drawer
      anchor="right"
      open={notificationDrawer}
      onClose={() => setNotificationDrawer(false)}
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            Notifications
          </Typography>
          <Button
            size="small"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </Stack>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              alignItems="flex-start"
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                mb: 1,
                borderRadius: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${getNotificationColor(notification.type)}.main` }}>
                  {getNotificationIcon(notification.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(notification.timestamp), 'h:mm a')}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    {notification.metadata?.points && (
                      <Chip
                        size="small"
                        icon={<StarIcon />}
                        label={`+${notification.metadata.points} Points`}
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                    {notification.action && (
                      <Button
                        size="small"
                        onClick={() => onNotificationAction(notification.id, notification.action!.label)}
                        sx={{ mt: 1 }}
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Badge
          badgeContent={notifications.filter(n => !n.read).length}
          color="error"
        >
          <NotificationIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setNotificationDrawer(true);
          setAnchorEl(null);
        }}>
          View All Notifications
        </MenuItem>
        <MenuItem onClick={() => {
          onClearAll();
          setAnchorEl(null);
        }}>
          Clear All
        </MenuItem>
      </Menu>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => handleClose(currentNotification?.id || '')}
        TransitionComponent={SlideTransition}
      >
        <Alert
          severity={getNotificationColor(currentNotification?.type || 'achievement') as any}
          sx={{ width: '100%' }}
          action={
            currentNotification?.action && (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  onNotificationAction(currentNotification.id, currentNotification.action!.label);
                  handleClose(currentNotification.id);
                }}
              >
                {currentNotification.action.label}
              </Button>
            )
          }
        >
          <AlertTitle>{currentNotification?.title}</AlertTitle>
          {currentNotification?.message}
        </Alert>
      </Snackbar>

      {renderAchievementDialog()}
      {renderNotificationDrawer()}
    </>
  );
}
