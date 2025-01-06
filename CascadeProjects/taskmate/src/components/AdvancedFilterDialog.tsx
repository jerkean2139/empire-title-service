import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Client } from '../types/client';
import { FilterCondition, FilterGroup, FilterOperator } from '../store/clientStore';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (group: FilterGroup) => void;
}

const fieldOptions: { value: keyof Client; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'company', label: 'Company' },
  { value: 'status', label: 'Status' },
  { value: 'projectCount', label: 'Project Count' },
  { value: 'lastContact', label: 'Last Contact' },
  { value: 'createdAt', label: 'Created Date' },
];

const operatorOptions: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does Not Contain' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'lessThan', label: 'Less Than' },
  { value: 'between', label: 'Between' },
];

const statusOptions = ['active', 'inactive', 'pending'];

export default function AdvancedFilterDialog({ open, onClose, onApply }: Props) {
  const [conditions, setConditions] = useState<FilterCondition[]>([{
    field: 'name',
    operator: 'contains',
    value: '',
  }]);
  const [matchType, setMatchType] = useState<'AND' | 'OR'>('AND');

  const handleAddCondition = () => {
    setConditions([...conditions, {
      field: 'name',
      operator: 'contains',
      value: '',
    }]);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: keyof Client) => {
    const newConditions = [...conditions];
    newConditions[index] = {
      field,
      operator: 'contains',
      value: '',
    };
    setConditions(newConditions);
  };

  const handleOperatorChange = (index: number, operator: FilterOperator) => {
    const newConditions = [...conditions];
    newConditions[index] = {
      ...newConditions[index],
      operator,
      value: '',
      secondValue: undefined,
    };
    setConditions(newConditions);
  };

  const handleValueChange = (index: number, value: any, isSecondValue = false) => {
    const newConditions = [...conditions];
    if (isSecondValue) {
      newConditions[index] = {
        ...newConditions[index],
        secondValue: value,
      };
    } else {
      newConditions[index] = {
        ...newConditions[index],
        value,
      };
    }
    setConditions(newConditions);
  };

  const handleApply = () => {
    onApply({
      conditions,
      matchType,
    });
    onClose();
  };

  const renderValueInput = (condition: FilterCondition, index: number) => {
    if (condition.field === 'status') {
      return (
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={condition.value || ''}
            onChange={(e) => handleValueChange(index, e.target.value)}
            label="Status"
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (condition.field === 'lastContact' || condition.field === 'createdAt') {
      return (
        <Stack direction="row" spacing={1}>
          <TextField
            type="date"
            value={condition.value || ''}
            onChange={(e) => handleValueChange(index, e.target.value)}
            fullWidth
          />
          {condition.operator === 'between' && (
            <TextField
              type="date"
              value={condition.secondValue || ''}
              onChange={(e) => handleValueChange(index, e.target.value, true)}
              fullWidth
            />
          )}
        </Stack>
      );
    }

    if (condition.field === 'projectCount') {
      return (
        <Stack direction="row" spacing={1}>
          <TextField
            type="number"
            value={condition.value || ''}
            onChange={(e) => handleValueChange(index, e.target.value)}
            fullWidth
          />
          {condition.operator === 'between' && (
            <TextField
              type="number"
              value={condition.secondValue || ''}
              onChange={(e) => handleValueChange(index, e.target.value, true)}
              fullWidth
            />
          )}
        </Stack>
      );
    }

    return (
      <TextField
        value={condition.value || ''}
        onChange={(e) => handleValueChange(index, e.target.value)}
        fullWidth
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon />
          Advanced Filters
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={matchType === 'AND'}
                onChange={(e) => setMatchType(e.target.checked ? 'AND' : 'OR')}
              />
            }
            label={`Match ${matchType === 'AND' ? 'ALL' : 'ANY'} conditions`}
          />
        </Box>
        
        <Stack spacing={2}>
          {conditions.map((condition, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Field</InputLabel>
                <Select
                  value={condition.field}
                  onChange={(e) => handleFieldChange(index, e.target.value as keyof Client)}
                  label="Field"
                >
                  {fieldOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={condition.operator}
                  onChange={(e) => handleOperatorChange(index, e.target.value as FilterOperator)}
                  label="Operator"
                >
                  {operatorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ flexGrow: 1 }}>
                {renderValueInput(condition, index)}
              </Box>

              <IconButton
                onClick={() => handleRemoveCondition(index)}
                disabled={conditions.length === 1}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddCondition}
          sx={{ mt: 2 }}
        >
          Add Condition
        </Button>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={conditions.some(c => !c.value)}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}
