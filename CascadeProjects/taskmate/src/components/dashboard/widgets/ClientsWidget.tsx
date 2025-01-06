import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEntityStore } from '../../../stores/entityStore';
import { ClientForm } from '../../forms/ClientForm';

export function ClientsWidget() {
  const { clients } = useEntityStore();
  const [openForm, setOpenForm] = useState(false);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Clients</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          variant="contained"
          size="small"
        >
          Add Client
        </Button>
      </Box>

      <List>
        {clients.map((client) => (
          <ListItem
            key={client.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={client.name}
              secondary={`${client.projectCount || 0} Projects`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <ClientForm onClose={() => setOpenForm(false)} />
      </Dialog>
    </Box>
  );
}
