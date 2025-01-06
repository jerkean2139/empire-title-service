import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  SpeedDial,
  SpeedDialAction,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Badge,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  History as HistoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  PictureAsPdf as PDFIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

interface Version {
  id: string;
  number: string;
  userId: string;
  userName: string;
  timestamp: Date;
  changes: string;
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'sheet' | 'other';
  url: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  starred: boolean;
  locked: boolean;
  comments: Comment[];
  versions: Version[];
  permissions: {
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
}

interface Props {
  document: Document;
  onBack: () => void;
  onDownload: (doc: Document) => void;
  onShare: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  onAddComment: (doc: Document, comment: string) => void;
  onToggleStar: (doc: Document) => void;
  onToggleLock: (doc: Document) => void;
  onPrint: (doc: Document) => void;
}

export default function MobileDocumentViewer({
  document,
  onBack,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onAddComment,
  onToggleStar,
  onToggleLock,
  onPrint,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [zoom, setZoom] = useState(100);
  const [bottomNav, setBottomNav] = useState(0);

  const getDocumentIcon = () => {
    switch (document.type) {
      case 'pdf':
        return <PDFIcon />;
      case 'image':
        return <ImageIcon />;
      default:
        return <FileIcon />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleShare = () => {
    setShowShareDialog(true);
    setMenuAnchor(null);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(document, newComment);
      setNewComment('');
    }
  };

  const renderDocumentPreview = () => (
    <Paper
      sx={{
        height: 'calc(100vh - 128px)',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {document.type === 'image' ? (
        <img
          src={document.url}
          alt={document.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `scale(${zoom / 100})`,
            transition: 'transform 0.2s',
          }}
        />
      ) : (
        <iframe
          src={document.url}
          title={document.name}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      )}
    </Paper>
  );

  const renderComments = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <List>
        {document.comments.map(comment => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemIcon>
              <Avatar src={comment.userAvatar}>{comment.userName[0]}</Avatar>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                >
                  {comment.userName}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {comment.content}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    {format(new Date(comment.timestamp), 'MMM d, yyyy h:mm a')}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          sx={{ mt: 1 }}
          disabled={!newComment.trim()}
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  );

  const renderVersions = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Version History
      </Typography>
      <List>
        {document.versions.map(version => (
          <ListItem key={version.id}>
            <ListItemText
              primary={
                <Typography variant="subtitle2">
                  Version {version.number}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {version.changes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {version.userName} • {format(new Date(version.timestamp), 'MMM d, yyyy h:mm a')}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
          >
            {getDocumentIcon()}
            <Box>
              <Typography variant="subtitle1">
                {document.name}
              </Typography>
              <Typography variant="caption">
                {formatFileSize(document.size)} • Modified {format(new Date(document.modifiedAt), 'MMM d, yyyy')}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            color="inherit"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {bottomNav === 0 && renderDocumentPreview()}
      {bottomNav === 1 && renderComments()}
      {bottomNav === 2 && renderVersions()}

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          value={bottomNav}
          onChange={(_, newValue) => setBottomNav(newValue)}
        >
          <BottomNavigationAction label="Document" icon={<DocumentIcon />} />
          <BottomNavigationAction
            label="Comments"
            icon={
              <Badge badgeContent={document.comments.length} color="primary">
                <CommentIcon />
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Versions"
            icon={
              <Badge badgeContent={document.versions.length} color="primary">
                <HistoryIcon />
              </Badge>
            }
          />
        </BottomNavigation>
      </Paper>

      <SpeedDial
        ariaLabel="Document Actions"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        icon={<MoreIcon />}
      >
        <SpeedDialAction
          icon={<ZoomInIcon />}
          tooltipTitle="Zoom In"
          onClick={() => setZoom(z => Math.min(z + 10, 200))}
        />
        <SpeedDialAction
          icon={<ZoomOutIcon />}
          tooltipTitle="Zoom Out"
          onClick={() => setZoom(z => Math.max(z - 10, 50))}
        />
        <SpeedDialAction
          icon={<FullscreenIcon />}
          tooltipTitle="Full Screen"
          onClick={() => {}}
        />
      </SpeedDial>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          onDownload(document);
          setMenuAnchor(null);
        }}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ListItemIcon><ShareIcon /></ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        {document.permissions.canEdit && (
          <MenuItem onClick={() => {
            onEdit(document);
            setMenuAnchor(null);
          }}>
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          onToggleStar(document);
          setMenuAnchor(null);
        }}>
          <ListItemIcon>
            {document.starred ? <StarIcon /> : <StarBorderIcon />}
          </ListItemIcon>
          <ListItemText>{document.starred ? 'Unstar' : 'Star'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          onToggleLock(document);
          setMenuAnchor(null);
        }}>
          <ListItemIcon>
            {document.locked ? <LockIcon /> : <UnlockIcon />}
          </ListItemIcon>
          <ListItemText>{document.locked ? 'Unlock' : 'Lock'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          onPrint(document);
          setMenuAnchor(null);
        }}>
          <ListItemIcon><PrintIcon /></ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        {document.permissions.canDelete && (
          <MenuItem onClick={() => {
            onDelete(document);
            setMenuAnchor(null);
          }}>
            <ListItemIcon><DeleteIcon /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        fullWidth
      >
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email addresses"
            placeholder="Enter email addresses separated by commas"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            onShare(document);
            setShowShareDialog(false);
          }}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
