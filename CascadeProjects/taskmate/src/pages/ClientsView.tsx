import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Avatar,
  Divider,
  useTheme,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Label as LabelIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  TuneOutlined as TuneIcon,
  FileDownload as FileDownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useClientStore } from '../store/clientStore';
import { ClientFormData } from '../types/client';
import { format } from 'date-fns';
import AdvancedFilterDialog from '../components/AdvancedFilterDialog';
import { FilterGroup } from '../store/clientStore';

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 56,
      height: 56,
      fontSize: '1.5rem',
    },
    children: initials,
  };
}

const statusColors = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
};

export default function ClientsView() {
  const {
    getFilteredClients,
    addClient,
    updateClient,
    deleteClient,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedTags,
    setSelectedTags,
  } = useClientStore();

  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const theme = useTheme();
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    status: 'active',
    tags: [],
  });

  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterGroup[]>([]);

  const filteredClients = getFilteredClients();
  const allTags = Array.from(
    new Set(filteredClients.flatMap((client) => client.tags))
  );

  const handleOpen = (clientId?: string) => {
    if (clientId) {
      const client = filteredClients.find((c) => c.id === clientId);
      if (client) {
        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone || '',
          company: client.company || '',
          address: client.address || '',
          notes: client.notes || '',
          status: client.status,
          tags: client.tags,
        });
        setEditingClient(clientId);
      }
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
        status: 'active',
        tags: [],
      });
      setEditingClient(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient, formData);
    } else {
      addClient(formData);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const content = useClientStore.getState().exportClients(format);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddFilter = (group: FilterGroup) => {
    setActiveFilters([...activeFilters]);
    useClientStore.getState().addFilterGroup(group);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    useClientStore.getState().clearFilters();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Clients ({filteredClients.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
        >
          Add Client
        </Button>
      </Box>

      {/* Advanced Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={() => setAdvancedFilterOpen(true)}
        >
          Advanced Filters
        </Button>
        
        {activeFilters.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            color="error"
          >
            Clear All Filters
          </Button>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={() => handleExport('csv')}
        >
          Export CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={() => handleExport('json')}
        >
          Export JSON
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(e.target.value as string[])}
              label="Tags"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Sort Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant={sortBy === 'name' ? 'contained' : 'outlined'}
          onClick={() => toggleSort('name')}
          startIcon={<SortIcon />}
        >
          Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
        </Button>
        <Button
          size="small"
          variant={sortBy === 'company' ? 'contained' : 'outlined'}
          onClick={() => toggleSort('company')}
          startIcon={<BusinessIcon />}
        >
          Company {sortBy === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
        </Button>
        <Button
          size="small"
          variant={sortBy === 'lastContact' ? 'contained' : 'outlined'}
          onClick={() => toggleSort('lastContact')}
          startIcon={<CalendarIcon />}
        >
          Last Contact {sortBy === 'lastContact' && (sortDirection === 'asc' ? '↑' : '↓')}
        </Button>
        <Button
          size="small"
          variant={sortBy === 'projectCount' ? 'contained' : 'outlined'}
          onClick={() => toggleSort('projectCount')}
          startIcon={<AssignmentIcon />}
        >
          Projects {sortBy === 'projectCount' && (sortDirection === 'asc' ? '↑' : '↓')}
        </Button>
      </Box>

      {/* Client Cards */}
      <Grid container spacing={4}>
        {filteredClients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Status Badge */}
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <Chip
                    label={client.status}
                    color={statusColors[client.status] as any}
                    size="small"
                  />
                </Box>

                {/* Header with Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge
                    badgeContent={client.projectCount}
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    <Avatar {...stringAvatar(client.name)} />
                  </Badge>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {client.name}
                    </Typography>
                    {client.company && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" />
                        {client.company}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Contact Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    {client.email}
                  </Typography>
                  {client.phone && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      {client.phone}
                    </Typography>
                  )}
                  {client.lastContact && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      Last Contact: {format(new Date(client.lastContact), 'MMM d, yyyy')}
                    </Typography>
                  )}
                </Box>

                {/* Tags */}
                {client.tags.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {client.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        icon={<LabelIcon />}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
              
              {/* Actions */}
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Tooltip title="Edit">
                  <IconButton 
                    onClick={() => handleOpen(client.id)}
                    sx={{ 
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: 'rgba(29, 185, 84, 0.1)' }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    onClick={() => handleDelete(client.id)}
                    sx={{ 
                      color: theme.palette.error.main,
                      '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value as string[] })
                    }
                    label="Tags"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {allTags.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        onApply={handleAddFilter}
      />
    </Container>
  );
}
