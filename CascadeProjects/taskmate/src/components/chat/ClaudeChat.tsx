import React, { useState, useEffect, useRef } from 'react';
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
  Fab,
  useTheme,
  CircularProgress,
  Slide,
  Alert,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useChatStore } from '../../stores/chatStore';
import { useEntityStore } from '../../stores/entityStore';
import { sendMessageToClaude } from '../../services/claudeApi';

export function ClaudeChat() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isSearching,
    error,
    addMessage,
    setIsSearching,
    setError,
  } = useChatStore();

  const {
    clients,
    projects,
    sprints,
    tasks,
  } = useEntityStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSearching) return;

    const userMessage = {
      text: input.trim(),
      sender: 'user' as const,
    };

    addMessage(userMessage);
    setInput('');
    setIsSearching(true);
    setError(null);

    try {
      const response = await sendMessageToClaude(
        userMessage.text,
        messages,
        {
          currentTasks: tasks,
          currentProjects: projects,
          currentSprints: sprints,
          currentClients: clients,
        }
      );

      addMessage({
        text: response.message,
        sender: 'claude',
        codeSnippets: response.codeSnippets,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response from Claude');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      {!isOpen && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(true)}
        >
          <ChatIcon />
        </Fab>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
            width: 400,
            height: 600,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6" component="div">
                Claude Assistant
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  gap: 1,
                  mb: 2,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'claude' ? 'primary.main' : 'secondary.main',
                    }}
                  >
                    {message.sender === 'claude' ? <SmartToyIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: message.sender === 'claude' ? 'grey.100' : 'primary.main',
                      color: message.sender === 'claude' ? 'text.primary' : 'primary.contrastText',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                    {message.codeSnippets?.map((snippet, index) => (
                      <Box key={index} sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {snippet.file}
                        </Typography>
                        <Paper
                          sx={{
                            p: 1,
                            mt: 0.5,
                            bgcolor: 'grey.900',
                            color: 'common.white',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            overflow: 'auto',
                          }}
                        >
                          <pre style={{ margin: 0 }}>{snippet.code}</pre>
                        </Paper>
                      </Box>
                    ))}
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'block',
                      color: 'text.secondary',
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>

          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Claude anything..."
              variant="outlined"
              size="small"
              disabled={isSearching}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim() || isSearching}
                    color="primary"
                  >
                    {isSearching ? (
                      <CircularProgress size={24} />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Slide>
    </>
  );
}
