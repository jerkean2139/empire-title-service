import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Avatar,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  Psychology as AIIcon,
  Assessment as AnalyticsIcon,
  Lightbulb as InsightIcon,
  TrendingUp as TrendIcon,
  Person as PersonIcon,
  Business as CompanyIcon,
  Task as TaskIcon,
  Schedule as TimeIcon,
  Flag as FlagIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  context?: {
    type: 'project' | 'task' | 'client' | 'team' | 'metric';
    id: string;
    title: string;
  };
  insights?: Array<{
    type: 'performance' | 'trend' | 'suggestion' | 'risk';
    title: string;
    description: string;
    score?: number;
  }>;
}

interface EntityInsight {
  id: string;
  name: string;
  type: 'client' | 'team' | 'project';
  metrics: {
    efficiency: number;
    satisfaction: number;
    completion: number;
  };
  trends: Array<{
    metric: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }>;
  recommendations: string[];
}

interface Props {
  onSendMessage: (content: string, context?: Message['context']) => Promise<Message>;
  onFetchInsights: (entityId: string, type: EntityInsight['type']) => Promise<EntityInsight>;
  onGenerateReport: (type: string, dateRange: [Date, Date]) => Promise<string>;
  onEarnPoints: (points: number, reason: string) => void;
}

export default function ProjectAssistant({
  onSendMessage,
  onFetchInsights,
  onGenerateReport,
  onEarnPoints,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityInsight | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Process the message with RAG system
      const response = await onSendMessage(inputValue);
      
      setMessages(prev => [...prev, response]);

      // Award points for meaningful interactions
      if (response.insights && response.insights.length > 0) {
        onEarnPoints(5, 'Insightful AI interaction');
      }
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'assistant',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchInsights = async (entityId: string, type: EntityInsight['type']) => {
    setIsLoading(true);
    try {
      const insights = await onFetchInsights(entityId, type);
      setSelectedEntity(insights);
      setShowInsights(true);
      onEarnPoints(3, 'Analyzed insights');
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => (
    <Stack
      key={message.id}
      direction="row"
      spacing={2}
      sx={{
        mb: 2,
        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      {message.type === 'assistant' && (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <AIIcon />
        </Avatar>
      )}

      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          sx={{
            p: 2,
            bgcolor: message.type === 'user' ? 'primary.main' : 'background.paper',
            color: message.type === 'user' ? 'primary.contrastText' : 'text.primary',
          }}
        >
          <Typography variant="body1">
            {message.content}
          </Typography>

          {message.context && (
            <Chip
              icon={
                message.context.type === 'project' ? <TaskIcon /> :
                message.context.type === 'client' ? <CompanyIcon /> :
                message.context.type === 'team' ? <PersonIcon /> :
                <FlagIcon />
              }
              label={message.context.title}
              size="small"
              sx={{ mt: 1 }}
            />
          )}

          {message.insights && message.insights.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {message.insights.map((insight, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InsightIcon color="primary" />
                      <Typography variant="subtitle2">
                        {insight.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {insight.description}
                    </Typography>
                    {insight.score !== undefined && (
                      <LinearProgress
                        variant="determinate"
                        value={insight.score}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </Typography>
        </Paper>

        {message.attachments && message.attachments.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {message.attachments.map(attachment => (
              <Chip
                key={attachment.id}
                label={attachment.name}
                onClick={() => window.open(attachment.url)}
                size="small"
              />
            ))}
          </Stack>
        )}
      </Box>

      {message.type === 'user' && (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <PersonIcon />
        </Avatar>
      )}
    </Stack>
  );

  const renderInsightsDialog = () => (
    <Dialog
      open={showInsights}
      onClose={() => setShowInsights(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedEntity && (
        <>
          <DialogTitle>
            <Stack direction="row" spacing={2} alignItems="center">
              {selectedEntity.type === 'client' ? <CompanyIcon /> :
               selectedEntity.type === 'team' ? <PersonIcon /> :
               <TaskIcon />}
              <Typography variant="h6">
                {selectedEntity.name} Insights
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              {/* Performance Metrics */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Stack spacing={1} alignItems="center">
                        <CircularProgress
                          variant="determinate"
                          value={selectedEntity.metrics.efficiency}
                          size={80}
                        />
                        <Typography>Efficiency</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={1} alignItems="center">
                        <CircularProgress
                          variant="determinate"
                          value={selectedEntity.metrics.satisfaction}
                          size={80}
                          color="success"
                        />
                        <Typography>Satisfaction</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={1} alignItems="center">
                        <CircularProgress
                          variant="determinate"
                          value={selectedEntity.metrics.completion}
                          size={80}
                          color="secondary"
                        />
                        <Typography>Completion</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Trends */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Trends
                  </Typography>
                  <List>
                    {selectedEntity.trends.map((trend, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendIcon
                            color={
                              trend.trend === 'up' ? 'success' :
                              trend.trend === 'down' ? 'error' :
                              'action'
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={trend.metric}
                          secondary={`${trend.change > 0 ? '+' : ''}${trend.change}% change`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <List>
                    {selectedEntity.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InsightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowInsights(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                onGenerateReport(selectedEntity.type, [new Date(), new Date()]);
                setShowInsights(false);
              }}
            >
              Generate Report
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Ask me anything about your projects, clients, or team..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            multiline
            maxRows={4}
          />
          <IconButton onClick={() => setMenuAnchor(null)}>
            <AttachIcon />
          </IconButton>
          <Button
            variant="contained"
            endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </Button>
        </Stack>
      </Paper>

      {renderInsightsDialog()}
    </Box>
  );
}
