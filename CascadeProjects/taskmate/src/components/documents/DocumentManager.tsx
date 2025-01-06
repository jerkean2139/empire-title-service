import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  LinearProgress,
  Badge,
  Breadcrumbs,
  Link,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  PictureAsPdf as PDFIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as CopyIcon,
  History as HistoryIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  CloudUpload as UploadIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'image' | 'doc' | 'sheet' | 'other';
  size?: number;
  createdAt: Date;
  modifiedAt: Date;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  starred: boolean;
  locked: boolean;
  shared: boolean;
  path: string[];
  tags: string[];
  permissions: {
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
  metadata?: {
    description?: string;
    version?: string;
    status?: string;
    customFields?: Record<string, string>;
  };
}

interface Props {
  documents: Document[];
  onCreateFolder: (name: string, path: string[]) => void;
  onUploadFiles: (files: FileList, path: string[]) => void;
  onDeleteDocument: (doc: Document) => void;
  onMoveDocument: (doc: Document, newPath: string[]) => void;
  onCopyDocument: (doc: Document, newPath: string[]) => void;
  onRenameDocument: (doc: Document, newName: string) => void;
  onShareDocument: (doc: Document, emails: string[], message: string) => void;
  onToggleStar: (doc: Document) => void;
  onToggleLock: (doc: Document) => void;
  onUpdateTags: (doc: Document, tags: string[]) => void;
  onUpdateMetadata: (doc: Document, metadata: Document['metadata']) => void;
}

export default function DocumentManager({
  documents,
  onCreateFolder,
  onUploadFiles,
  onDeleteDocument,
  onMoveDocument,
  onCopyDocument,
  onRenameDocument,
  onShareDocument,
  onToggleStar,
  onToggleLock,
  onUpdateTags,
  onUpdateMetadata,
}: Props) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareEmails, setShareEmails] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadProgress(0);
      onUploadFiles(event.target.files, currentPath);
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null || prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadProgress(null), 1000);
            return null;
          }
          return prev + 10;
        });
      }, 500);
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'folder':
        return <FolderIcon />;
      case 'pdf':
        return <PDFIcon />;
      case 'image':
        return <ImageIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCurrentDocuments = () => {
    return documents
      .filter(doc => 
        doc.path.join('/') === currentPath.join('/') &&
        (searchQuery
          ? doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          : true)
      )
      .sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'date':
            comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
            break;
          case 'size':
            comparison = (a.size || 0) - (b.size || 0);
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  };

  const handleShare = () => {
    if (selectedDocument && shareEmails) {
      onShareDocument(
        selectedDocument,
        shareEmails.split(',').map(email => email.trim()),
        shareMessage
      );
      setShowShare(false);
      setShareEmails('');
      setShareMessage('');
    }
  };

  const renderBreadcrumbs = () => (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link
        component="button"
        variant="body1"
        onClick={() => setCurrentPath([])}
        color="inherit"
      >
        Home
      </Link>
      {currentPath.map((folder, index) => (
        <Link
          key={folder}
          component="button"
          variant="body1"
          onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
          color="inherit"
        >
          {folder}
        </Link>
      ))}
    </Breadcrumbs>
  );

  const renderToolbar = () => (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ mb: 3 }}
    >
      <TextField
        placeholder="Search files and folders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1 }}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShowCreateFolder(true)}
      >
        New Folder
      </Button>
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        component="label"
      >
        Upload
        <input
          type="file"
          hidden
          multiple
          onChange={handleFileUpload}
        />
      </Button>
      <Tooltip title="View">
        <IconButton onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}>
          {view === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Sort">
        <IconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Filter">
        <IconButton>
          <FilterIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const renderGridView = () => (
    <Grid container spacing={2}>
      {getCurrentDocuments().map(doc => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                {getDocumentIcon(doc.type)}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {doc.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(doc.size)}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedDocument(doc);
                    setMenuAnchor(e.currentTarget);
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Stack>
              {doc.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {doc.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
            <CardActions>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Avatar
                  src={doc.owner.avatar}
                  sx={{ width: 24, height: 24 }}
                >
                  {doc.owner.name[0]}
                </Avatar>
                <Typography variant="caption" sx={{ flexGrow: 1 }}>
                  {format(new Date(doc.modifiedAt), 'MMM d, yyyy')}
                </Typography>
                {doc.shared && (
                  <Tooltip title="Shared">
                    <ShareIcon fontSize="small" color="action" />
                  </Tooltip>
                )}
                {doc.locked && (
                  <Tooltip title="Locked">
                    <LockIcon fontSize="small" color="action" />
                  </Tooltip>
                )}
                {doc.starred && (
                  <Tooltip title="Starred">
                    <StarIcon fontSize="small" color="warning" />
                  </Tooltip>
                )}
              </Stack>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <List>
      {getCurrentDocuments().map(doc => (
        <Paper key={doc.id} sx={{ mb: 1 }}>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => {
                  setSelectedDocument(doc);
                  setMenuAnchor(e.currentTarget);
                }}
              >
                <MoreIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              {getDocumentIcon(doc.type)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1">
                    {doc.name}
                  </Typography>
                  {doc.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              }
              secondary={
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 0.5 }}
                >
                  <Avatar
                    src={doc.owner.avatar}
                    sx={{ width: 24, height: 24 }}
                  >
                    {doc.owner.name[0]}
                  </Avatar>
                  <Typography variant="caption">
                    {formatFileSize(doc.size)}
                  </Typography>
                  <Typography variant="caption">
                    Modified {format(new Date(doc.modifiedAt), 'MMM d, yyyy')}
                  </Typography>
                  {doc.shared && <ShareIcon fontSize="small" color="action" />}
                  {doc.locked && <LockIcon fontSize="small" color="action" />}
                  {doc.starred && <StarIcon fontSize="small" color="warning" />}
                </Stack>
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      {renderBreadcrumbs()}
      {renderToolbar()}

      {uploadProgress !== null && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {view === 'grid' ? renderGridView() : renderListView()}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedDocument(null);
        }}
      >
        {selectedDocument?.type === 'folder' && (
          <MenuItem onClick={() => {
            if (selectedDocument) {
              setCurrentPath([...selectedDocument.path, selectedDocument.name]);
            }
            setMenuAnchor(null);
          }}>
            <ListItemIcon><FolderIcon /></ListItemIcon>
            <ListItemText>Open</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (selectedDocument) {
            onToggleStar(selectedDocument);
          }
          setMenuAnchor(null);
        }}>
          <ListItemIcon>
            {selectedDocument?.starred ? <StarIcon /> : <StarBorderIcon />}
          </ListItemIcon>
          <ListItemText>
            {selectedDocument?.starred ? 'Unstar' : 'Star'}
          </ListItemText>
        </MenuItem>
        {selectedDocument?.permissions.canShare && (
          <MenuItem onClick={() => {
            setShowShare(true);
            setMenuAnchor(null);
          }}>
            <ListItemIcon><ShareIcon /></ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (selectedDocument) {
            onToggleLock(selectedDocument);
          }
          setMenuAnchor(null);
        }}>
          <ListItemIcon>
            {selectedDocument?.locked ? <LockIcon /> : <UnlockIcon />}
          </ListItemIcon>
          <ListItemText>
            {selectedDocument?.locked ? 'Unlock' : 'Lock'}
          </ListItemText>
        </MenuItem>
        {selectedDocument?.permissions.canEdit && (
          <MenuItem onClick={() => {
            setShowMetadata(true);
            setMenuAnchor(null);
          }}>
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText>Edit Details</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (selectedDocument) {
            const element = document.createElement('a');
            element.href = URL.createObjectURL(new Blob(['']));
            element.download = selectedDocument.name;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }
          setMenuAnchor(null);
        }}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        {selectedDocument?.permissions.canDelete && (
          <MenuItem onClick={() => {
            if (selectedDocument) {
              onDeleteDocument(selectedDocument);
            }
            setMenuAnchor(null);
          }}>
            <ListItemIcon><DeleteIcon /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateFolder(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (newFolderName.trim()) {
                onCreateFolder(newFolderName.trim(), currentPath);
                setNewFolderName('');
                setShowCreateFolder(false);
              }
            }}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showShare}
        onClose={() => setShowShare(false)}
        fullWidth
      >
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Addresses"
            fullWidth
            helperText="Separate multiple emails with commas"
            value={shareEmails}
            onChange={(e) => setShareEmails(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={3}
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShare(false)}>Cancel</Button>
          <Button onClick={handleShare} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showMetadata}
        onClose={() => setShowMetadata(false)}
        fullWidth
      >
        <DialogTitle>Edit Document Details</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                fullWidth
                value={selectedDocument.name}
                onChange={(e) => setSelectedDocument({
                  ...selectedDocument,
                  name: e.target.value,
                })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={selectedDocument.metadata?.description || ''}
                onChange={(e) => setSelectedDocument({
                  ...selectedDocument,
                  metadata: {
                    ...selectedDocument.metadata,
                    description: e.target.value,
                  },
                })}
              />
              <TextField
                label="Tags"
                fullWidth
                value={selectedDocument.tags.join(', ')}
                onChange={(e) => setSelectedDocument({
                  ...selectedDocument,
                  tags: e.target.value.split(',').map(tag => tag.trim()),
                })}
                helperText="Separate tags with commas"
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedDocument.metadata?.status || ''}
                  label="Status"
                  onChange={(e) => setSelectedDocument({
                    ...selectedDocument,
                    metadata: {
                      ...selectedDocument.metadata,
                      status: e.target.value,
                    },
                  })}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="review">In Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMetadata(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedDocument) {
                onRenameDocument(selectedDocument, selectedDocument.name);
                onUpdateTags(selectedDocument, selectedDocument.tags);
                onUpdateMetadata(selectedDocument, selectedDocument.metadata);
              }
              setShowMetadata(false);
            }}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
