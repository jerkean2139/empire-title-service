import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Flag as PriorityIcon,
  Schedule as DeadlineIcon,
  Person as AssigneeIcon,
  Description as DescriptionIcon,
  AttachFile as AttachmentIcon,
  Comment as CommentIcon,
  CheckBox as ChecklistIcon,
  Label as TagIcon,
  Timer as TimeIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  assignedTo: User[];
  assignedBy: User;
  deadline: Date;
  attachments: Attachment[];
  comments: Comment[];
  checklist: ChecklistItem[];
  tags: string[];
  timeTracking: {
    estimated: number;
    spent: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  attachments: Attachment[];
  reactions: Reaction[];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: User;
  dueDate?: Date;
}

interface Props {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddComment: (taskId: string, comment: Partial<Comment>) => void;
  onAddChecklist: (taskId: string, item: Partial<ChecklistItem>) => void;
  onUploadAttachment: (taskId: string, file: File) => void;
}

export default function TaskDetails({
  task,
  onUpdateTask,
  onAddComment,
  onAddChecklist,
  onUploadAttachment,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'review':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'todo':
        return 'default';
    }
  };

  const renderHeader = () => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h5">
          {editMode ? (
            <TextField
              defaultValue={task.title}
              variant="standard"
              fullWidth
            />
          ) : (
            task.title
          )}
        </Typography>
        <Chip
          label={task.status}
          color={getStatusColor(task.status)}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setEditMode(!editMode)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {editMode ? 'Save Changes' : 'Edit Task'}
            </ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );

  const renderDetails = () => (
    <Grid container spacing={3}>
      {/* Left Column */}
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {/* Description */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Description
                </Typography>
                {editMode ? (
                  <TextField
                    defaultValue={task.description}
                    multiline
                    rows={4}
                    fullWidth
                  />
                ) : (
                  <Typography>
                    {task.description}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">
                    Checklist
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {/* Add checklist item */}}
                  >
                    Add Item
                  </Button>
                </Stack>
                <List>
                  {task.checklist.map(item => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        item.assignedTo && (
                          <Chip
                            avatar={<Avatar src={item.assignedTo.avatar} />}
                            label={item.assignedTo.name}
                            size="small"
                          />
                        )
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={item.completed}
                          onChange={() => {/* Toggle completion */}}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={
                          item.dueDate &&
                          `Due: ${new Date(item.dueDate).toLocaleDateString()}`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Comments
                </Typography>
                <TextField
                  placeholder="Add a comment..."
                  multiline
                  rows={2}
                  fullWidth
                />
                <List>
                  {task.comments.map(comment => (
                    <ListItem key={comment.id} alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar src={comment.user.avatar}>
                          {comment.user.name[0]}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle2">
                              {comment.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.timestamp).toLocaleString()}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Box>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {comment.content}
                            </Typography>
                            {comment.attachments.length > 0 && (
                              <Stack direction="row" spacing={1} mt={1}>
                                {comment.attachments.map(attachment => (
                                  <Chip
                                    key={attachment.id}
                                    icon={<AttachmentIcon />}
                                    label={attachment.name}
                                    size="small"
                                    onClick={() => {/* Open attachment */}}
                                  />
                                ))}
                              </Stack>
                            )}
                            {comment.reactions.length > 0 && (
                              <Stack direction="row" spacing={1} mt={1}>
                                {comment.reactions.map((reaction, index) => (
                                  <Chip
                                    key={index}
                                    label={`${reaction.emoji} ${reaction.count}`}
                                    size="small"
                                    onClick={() => {/* Show users */}}
                                  />
                                ))}
                              </Stack>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {/* Status and Priority */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<PriorityIcon />}
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                  />
                  <Chip
                    icon={<DeadlineIcon />}
                    label={new Date(task.deadline).toLocaleDateString()}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Assignees */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    Assignees
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setShowAssignDialog(true)}
                  >
                    Assign
                  </Button>
                </Stack>
                <AvatarGroup max={4}>
                  {task.assignedTo.map(user => (
                    <Avatar
                      key={user.id}
                      src={user.avatar}
                      alt={user.name}
                    >
                      {user.name[0]}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Stack>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1">
                  Time Tracking
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    Estimated: {task.timeTracking.estimated}h
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(task.timeTracking.spent / task.timeTracking.estimated) * 100}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Spent: {task.timeTracking.spent}h
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1">
                  Tags
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {task.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => {/* Remove tag */}}
                    />
                  ))}
                  <Chip
                    icon={<AddIcon />}
                    label="Add Tag"
                    variant="outlined"
                    onClick={() => {/* Add tag */}}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1">
                  Attachments
                </Typography>
                <List>
                  {task.attachments.map(attachment => (
                    <ListItem
                      key={attachment.id}
                      secondaryAction={
                        <IconButton>
                          <DownloadIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <AttachmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={attachment.name}
                        secondary={`${attachment.size}KB • ${new Date(
                          attachment.uploadedAt
                        ).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  component="label"
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Attachment
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        onUploadAttachment(task.id, e.target.files[0]);
                      }
                    }}
                  />
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {renderHeader()}
        {renderDetails()}
      </Stack>

      {/* Assign Dialog */}
      <Dialog
        open={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
      >
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          {/* User selection list */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAssignDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setShowAssignDialog(false)}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
