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
  Divider,
  Menu,
  MenuItem,
  Button,
  Stack,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  InsertEmoticon as EmojiIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
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
  onDeleteMessage: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onSearchMessages: (query: string) => void;
}

export default function ClientPortalChat({
  currentUser,
  participants,
  messages,
  onSendMessage,
  onDeleteMessage,
  onAddReaction,
  onSearchMessages,
}: Props) {
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments([...attachments, ...Array.from(event.target.files)]);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    if (selectedMessage) {
      onAddReaction(selectedMessage, emoji.emoji);
      setSelectedMessage(null);
    } else {
      setNewMessage(prev => prev + emoji.emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleMessageMenu = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
    setSelectedMessage(messageId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const renderMessage = (message: Message) => {
    const sender = participants.find(p => p.id === message.senderId);
    const isCurrentUser = message.senderId === currentUser.id;

    return (
      <ListItem
        key={message.id}
        sx={{
          flexDirection: 'column',
          alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
          py: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ maxWidth: '70%' }}
        >
          {!isCurrentUser && (
            <ListItemAvatar>
              <Avatar src={sender?.customFields.avatar}>
                {sender?.firstName[0]}{sender?.lastName[0]}
              </Avatar>
            </ListItemAvatar>
          )}
          <Box>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
              }}
            >
              {!isCurrentUser && (
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {sender?.firstName} {sender?.lastName}
                </Typography>
              )}
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {message.attachments.map(attachment => (
                    <Chip
                      key={attachment.id}
                      label={attachment.name}
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(attachment.url)}
                      sx={{ mr: 1, mt: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Paper>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(message.timestamp), 'MMM d, h:mm a')}
              </Typography>
              {message.reactions && message.reactions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {message.reactions.map(reaction => (
                    <Chip
                      key={reaction.emoji}
                      label={`${reaction.emoji} ${reaction.users.length}`}
                      size="small"
                      onClick={() => onAddReaction(message.id, reaction.emoji)}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => handleMessageMenu(e, message.id)}
          >
            <MoreIcon />
          </IconButton>
        </Stack>
      </ListItem>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2 }} elevation={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Team Chat ({participants.length} members)
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Search">
              <IconButton onClick={() => setShowSearch(!showSearch)}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        {showSearch && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchMessages(e.target.value);
            }}
            sx={{ mt: 2 }}
          />
        )}
      </Paper>

      {/* Messages */}
      <List sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </List>

      {/* Input */}
      <Paper sx={{ p: 2, mt: 2 }} elevation={1}>
        {attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Attachments:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                />
              ))}
            </Stack>
          </Box>
        )}
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <EmojiIcon />
          </IconButton>
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <AttachIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && attachments.length === 0}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Emoji Picker */}
      <Dialog
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        maxWidth="xs"
      >
        <DialogContent>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </DialogContent>
      </Dialog>

      {/* Message Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          onAddReaction(selectedMessage!, '👍');
          handleMenuClose();
        }}>
          Add Reaction
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedMessage) onDeleteMessage(selectedMessage);
          handleMenuClose();
        }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Message
        </MenuItem>
      </Menu>
    </Box>
  );
}
