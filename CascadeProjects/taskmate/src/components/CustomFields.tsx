import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Stack,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CustomField } from '../types/client';

interface Props {
  fields: CustomField[];
  onAddField: (field: Omit<CustomField, 'id'>) => void;
  onEditField: (id: string, field: Partial<CustomField>) => void;
  onDeleteField: (id: string) => void;
  onReorderFields: (startIndex: number, endIndex: number) => void;
}

export default function CustomFields({
  fields,
  onAddField,
  onEditField,
  onDeleteField,
  onReorderFields,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text' as CustomField['type'],
    options: [] as string[],
  });
  const [newOption, setNewOption] = useState('');

  const handleOpen = (field?: CustomField) => {
    if (field) {
      setFormData({
        name: field.name,
        type: field.type,
        options: field.options || [],
      });
      setEditingId(field.id);
    } else {
      setFormData({
        name: '',
        type: 'text',
        options: [],
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldData = {
      name: formData.name,
      type: formData.type,
      value: '',
      options: formData.type === 'select' ? formData.options : undefined,
    };

    if (editingId) {
      onEditField(editingId, fieldData);
    } else {
      onAddField(fieldData);
    }
    setOpen(false);
  };

  const handleAddOption = () => {
    if (newOption && !formData.options.includes(newOption)) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption],
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    setFormData({
      ...formData,
      options: formData.options.filter(o => o !== option),
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorderFields(result.source.index, result.destination.index);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Custom Fields</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Field
            </Button>
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DragIndicatorIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle1">{field.name}</Typography>
                                <Chip
                                  label={field.type}
                                  size="small"
                                  variant="outlined"
                                />
                                {field.type === 'select' && field.options && (
                                  <Chip
                                    label={`${field.options.length} options`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Stack>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleOpen(field)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => onDeleteField(field.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Custom Field' : 'Add Custom Field'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Field Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Field Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomField['type'] })}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                </Select>
              </FormControl>

              {formData.type === 'select' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Options</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={handleAddOption}
                        disabled={!newOption}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.options.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onDelete={() => handleRemoveOption(option)}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formData.type === 'select' && formData.options.length === 0}
            >
              {editingId ? 'Save Changes' : 'Add Field'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
