import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Collapse,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useEntityStore } from '../../stores/entityStore';
import { claudeApi } from '../../services/claudeApi';
import { aiPrioritizationService } from '../../services/aiPrioritization';

interface Suggestion {
  id: string;
  type: 'reschedule' | 'priority' | 'dependency' | 'optimization';
  description: string;
  applied: boolean;
}

export function AIAssistant() {
  const theme = useTheme();
  const { tasks, projects, updateTask } = useEntityStore();
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    generateSuggestions();
  }, [tasks, projects]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // Get AI recommendations
      const prioritizedTasks = await aiPrioritizationService.prioritizeTasks(tasks, projects);
      
      // Generate suggestions based on AI analysis
      const newSuggestions: Suggestion[] = [];

      // Check for scheduling conflicts
      tasks.forEach(task => {
        if (task.scheduledDate) {
          const conflictingTasks = tasks.filter(t => 
            t.id !== task.id &&
            t.scheduledDate &&
            new Date(t.scheduledDate).getTime() === new Date(task.scheduledDate).getTime()
          );

          if (conflictingTasks.length > 0) {
            newSuggestions.push({
              id: `conflict-${task.id}`,
              type: 'reschedule',
              description: `Resolve scheduling conflict between "${task.title}" and "${conflictingTasks[0].title}"`,
              applied: false,
            });
          }
        }
      });

      // Check for priority mismatches
      prioritizedTasks.forEach(task => {
        const currentTask = tasks.find(t => t.id === task.id);
        if (currentTask && currentTask.priority !== task.priority) {
          newSuggestions.push({
            id: `priority-${task.id}`,
            type: 'priority',
            description: `Update priority of "${task.title}" from ${currentTask.priority} to ${task.priority}`,
            applied: false,
          });
        }
      });

      // Check for potential dependencies
      tasks.forEach(task => {
        const relatedTasks = tasks.filter(t =>
          t.id !== task.id &&
          (t.title.toLowerCase().includes(task.title.toLowerCase()) ||
           task.title.toLowerCase().includes(t.title.toLowerCase()))
        );

        if (relatedTasks.length > 0) {
          newSuggestions.push({
            id: `dependency-${task.id}`,
            type: 'dependency',
            description: `Consider adding dependency between "${task.title}" and "${relatedTasks[0].title}"`,
            applied: false,
          });
        }
      });

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestion: Suggestion) => {
    const [type, taskId] = suggestion.id.split('-');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch (type) {
      case 'conflict':
        // Find next available slot
        const nextSlot = await aiPrioritizationService.findBestSlot(task, []);
        if (nextSlot) {
          await updateTask({ ...task, scheduledDate: nextSlot });
        }
        break;

      case 'priority':
        const prioritizedTasks = await aiPrioritizationService.prioritizeTasks([task], projects);
        const prioritizedTask = prioritizedTasks[0];
        if (prioritizedTask) {
          await updateTask({ ...task, priority: prioritizedTask.priority });
        }
        break;

      case 'dependency':
        // Find related task
        const relatedTasks = tasks.filter(t =>
          t.id !== task.id &&
          (t.title.toLowerCase().includes(task.title.toLowerCase()) ||
           task.title.toLowerCase().includes(t.title.toLowerCase()))
        );

        if (relatedTasks.length > 0) {
          await updateTask({
            ...task,
            dependencies: [...(task.dependencies || []), relatedTasks[0].id],
          });
        }
        break;
    }

    // Mark suggestion as applied
    setSuggestions(prev =>
      prev.map(s =>
        s.id === suggestion.id ? { ...s, applied: true } : s
      )
    );
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await claudeApi.analyze(`
        Analyze this task management query and provide actionable insights:
        ${query}

        Current tasks: ${JSON.stringify(tasks)}
        Current projects: ${JSON.stringify(projects)}
      `);

      // Add AI response as a suggestion
      setSuggestions(prev => [
        ...prev,
        {
          id: `optimization-${Date.now()}`,
          type: 'optimization',
          description: response,
          applied: false,
        },
      ]);

      setQuery('');
    } catch (error) {
      console.error('Error processing query:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 400,
        maxHeight: expanded ? '70vh' : 'auto',
        transition: 'max-height 0.3s ease-in-out',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6">AI Assistant</Typography>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: '40vh' }}>
            {suggestions.map((suggestion) => (
              <ListItem
                key={suggestion.id}
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: 1,
                  mb: 1,
                  opacity: suggestion.applied ? 0.6 : 1,
                }}
              >
                <ListItemText
                  primary={suggestion.description}
                  secondary={
                    <Chip
                      size="small"
                      label={suggestion.type}
                      color={
                        suggestion.type === 'reschedule' ? 'warning' :
                        suggestion.type === 'priority' ? 'error' :
                        suggestion.type === 'dependency' ? 'info' :
                        'default'
                      }
                      sx={{ mt: 1 }}
                    />
                  }
                />
                {!suggestion.applied && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleApplySuggestion(suggestion)}
                  >
                    <AutoAwesomeIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask AI for help..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleQuery();
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleQuery}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}
