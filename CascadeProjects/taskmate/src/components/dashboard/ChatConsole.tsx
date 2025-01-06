import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export function ChatConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'User', // Replace with actual user name
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Team Chat
      </Typography>

      <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <Avatar sx={{ mr: 2 }}>{message.sender[0]}</Avatar>
            <ListItemText
              primary={message.sender}
              secondary={message.text}
              secondaryTypographyProps={{
                sx: { whiteSpace: 'pre-wrap' },
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
