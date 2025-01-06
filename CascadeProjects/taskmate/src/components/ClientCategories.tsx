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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ColorPicker,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
} from '@mui/icons-material';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  parentId?: string;
}

interface Props {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (id: string, category: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export default function ClientCategories({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
    parentId: '',
  });

  const handleOpen = (category?: Category) => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        color: category.color,
        parentId: category.parentId || '',
      });
      setEditingId(category.id);
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
        parentId: '',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      parentId: formData.parentId || undefined,
    };

    if (editingId) {
      onEditCategory(editingId, categoryData);
    } else {
      onAddCategory(categoryData);
    }
    setOpen(false);
  };

  const getCategoryHierarchy = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category & { children?: Category[] }>();
    const roots: (Category & { children?: Category[] })[] = [];

    // Create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build hierarchy
    categories.forEach(category => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(categoryMap.get(category.id)!);
      } else {
        roots.push(categoryMap.get(category.id)!);
      }
    });

    return roots;
  };

  const renderCategoryItem = (category: Category & { children?: Category[] }, level = 0) => (
    <React.Fragment key={category.id}>
      <ListItem sx={{ pl: level * 4 }}>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1} alignItems="center">
              <CategoryIcon sx={{ color: category.color }} />
              <Typography variant="subtitle1">{category.name}</Typography>
              <Chip
                label={`${category.children?.length || 0} subcategories`}
                size="small"
                variant="outlined"
              />
            </Stack>
          }
          secondary={category.description}
        />
        <ListItemSecondaryAction>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpen(category)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDeleteCategory(category.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      {category.children?.map(child => renderCategoryItem(child, level + 1))}
      {level === 0 && <Divider />}
    </React.Fragment>
  );

  const hierarchy = getCategoryHierarchy(categories);

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Client Categories</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Category
            </Button>
          </Box>

          <List>
            {hierarchy.map(category => renderCategoryItem(category))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parentId}
                  label="Parent Category"
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {categories.map(category => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                      disabled={category.id === editingId}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <ColorPicker
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Save Changes' : 'Add Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
