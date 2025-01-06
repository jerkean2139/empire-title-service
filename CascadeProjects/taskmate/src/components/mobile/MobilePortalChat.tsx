import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  AppBar,
  Toolbar,
  SwipeableDrawer,
  Stack,
  Chip,
  Menu,
  MenuItem,
  Badge,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  SpeedDial,
  SpeedDialAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  InsertEmoticon as EmojiIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Camera as CameraIcon,
  Mic as MicIcon,
  LocationOn as LocationIcon,
  ContactMail as ContactIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { TeamMember } from '../../types/client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
}

interface Props {
  currentUser: TeamMember;
  participants: TeamMember[];
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  onBack: () => void;
  onSearch: (query: string) => void;
  onAttach: (files: File[]) => void;
  onRecord: () => void;
  onSchedule: () => void;
}

export default function MobilePortalChat({
  currentUser,
  participants,
  messages,
  onSendMessage,
  onBack,
  onSearch,
  onAttach,
  onRecord,
  onSchedule,
}: Props) {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (messageText.trim() || attachments.length > 0) {
      onSendMessage(messageText, attachments);
      setMessageText('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments([...attachments, ...Array.from(event.target.files)]);
    }
  };

  const speedDialActions = [
    { icon: <ImageIcon />, name: 'Image', onClick: () => fileInputRef.current?.click() },
    { icon: <CameraIcon />, name: 'Camera', onClick: () => {} },
    { icon: <LocationIcon />, name: 'Location', onClick: () => {} },
    { icon: <ContactIcon />, name: 'Contact', onClick: () => {} },
  ];

  const renderMessage = (message: Message) => {
    const sender = participants.find(p => p.id === message.senderId);
    const isCurrentUser = message.senderId === currentUser.id;

    return (
      <ListItem
        key={message.id}
        sx={{
          flexDirection: 'column',
          alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ maxWidth: '80%' }}
        >
          {!isCurrentUser && (
            <Avatar
              src={sender?.customFields.avatar}
              sx={{ width: 32, height: 32 }}
            >
              {sender?.firstName[0]}
            </Avatar>
          )}
          <Box>
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">
                {message.content}
              </Typography>
              {message.attachments && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {message.attachments.map(attachment => (
                    <Chip
                      key={attachment.id}
                      label={attachment.name}
                      size="small"
                      onClick={() => window.open(attachment.url)}
                    />
                  ))}
                </Stack>
              )}
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {format(new Date(message.timestamp), 'h:mm a')}
            </Typography>
          </Box>
        </Stack>
      </ListItem>
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack}>
            <BackIcon />
          </IconButton>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ flexGrow: 1, ml: 2 }}
            onClick={() => setShowParticipants(true)}
          >
            <Avatar
              src={participants[0]?.customFields.avatar}
              sx={{ width: 40, height: 40 }}
            >
              {participants[0]?.firstName[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {participants.length > 1
                  ? `${participants.length} participants`
                  : `${participants[0]?.firstName} ${participants[0]?.lastName}`}
              </Typography>
              <Typography variant="caption">
                {participants.some(p => p.customFields.online)
                  ? 'Online'
                  : 'Offline'}
              </Typography>
            </Box>
          </Stack>
          <IconButton color="inherit" onClick={() => setShowSearch(!showSearch)}>
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreIcon />
          </IconButton>
        </Toolbar>
        {showSearch && (
          <Paper sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
            />
          </Paper>
        )}
      </AppBar>

      <List sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </List>

      {attachments.length > 0 && (
        <Paper sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
            {attachments.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                onDelete={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                size="small"
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p: 1 }} elevation={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <EmojiIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {messageText.trim() ? (
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={onRecord}>
              <MicIcon />
            </IconButton>
          )}
        </Stack>
      </Paper>

      <SpeedDial
        ariaLabel="Attachments"
        sx={{ position: 'absolute', bottom: 80, right: 16 }}
        icon={<AttachIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.onClick();
              setSpeedDialOpen(false);
            }}
          />
        ))}
      </SpeedDial>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          setShowParticipants(true);
          setMenuAnchor(null);
        }}>
          View Participants
        </MenuItem>
        <MenuItem onClick={() => {
          onSchedule();
          setMenuAnchor(null);
        }}>
          Schedule Meeting
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          Clear Chat
        </MenuItem>
      </Menu>

      <Dialog
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        fullWidth
      >
        <DialogTitle>Participants</DialogTitle>
        <DialogContent>
          <List>
            {participants.map(participant => (
              <ListItem key={participant.id}>
                <ListItemAvatar>
                  <Avatar src={participant.customFields.avatar}>
                    {participant.firstName[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${participant.firstName} ${participant.lastName}`}
                  secondary={participant.role}
                />
                <Chip
                  label={participant.customFields.online ? 'Online' : 'Offline'}
                  color={participant.customFields.online ? 'success' : 'default'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowParticipants(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
