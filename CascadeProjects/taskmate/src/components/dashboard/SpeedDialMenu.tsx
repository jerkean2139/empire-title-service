import { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ClientForm } from '../forms/ClientForm';
import { ProjectForm } from '../forms/ProjectForm';
import { SprintForm } from '../forms/SprintForm';
import { TaskForm } from '../forms/TaskForm';
import { useEntityStore } from '../../stores/entityStore';

export function SpeedDialMenu() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState<string | null>(null);
  const { addClient, addProject, addSprint, addTask, clients, projects, sprints } = useEntityStore();

  const handleClose = () => {
    setOpenForm(null);
  };

  const handleClientSubmit = (client: any) => {
    addClient(client);
    handleClose();
  };

  const handleProjectSubmit = (project: any) => {
    addProject(project);
    handleClose();
  };

  const handleSprintSubmit = (sprint: any) => {
    addSprint(sprint);
    handleClose();
  };

  const handleTaskSubmit = (task: any) => {
    addTask(task);
    handleClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSpeedDialClose = () => {
    setOpen(false);
  };

  const actions = [
    {
      icon: <AddBusinessIcon />,
      name: 'Add Client',
      color: theme.palette.primary.main,
      onClick: () => {
        setOpenForm('client');
        handleSpeedDialClose();
      },
    },
    {
      icon: <AccountTreeIcon />,
      name: 'Add Project',
      color: theme.palette.secondary.main,
      onClick: () => {
        setOpenForm('project');
        handleSpeedDialClose();
      },
    },
    {
      icon: <DirectionsRunIcon />,
      name: 'Add Sprint',
      color: theme.palette.warning.main,
      onClick: () => {
        setOpenForm('sprint');
        handleSpeedDialClose();
      },
    },
    {
      icon: <AssignmentIcon />,
      name: 'Add Task',
      color: theme.palette.info.main,
      onClick: () => {
        setOpenForm('task');
        handleSpeedDialClose();
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <SpeedDial
          ariaLabel="Task Management SpeedDial"
          icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<CloseIcon />} />}
          onClose={handleSpeedDialClose}
          onOpen={handleOpen}
          open={open}
          direction="up"
          FabProps={{
            sx: {
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.9),
              },
            },
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
              FabProps={{
                sx: {
                  bgcolor: alpha(action.color, 0.1),
                  color: action.color,
                  '&:hover': {
                    bgcolor: alpha(action.color, 0.2),
                  },
                },
              }}
            />
          ))}
        </SpeedDial>
      </Box>

      <Dialog open={openForm === 'client'} onClose={handleClose}>
        <ClientForm onSubmit={handleClientSubmit} onClose={handleClose} />
      </Dialog>

      <Dialog open={openForm === 'project'} onClose={handleClose}>
        <ProjectForm onSubmit={handleProjectSubmit} onClose={handleClose} clients={clients} />
      </Dialog>

      <Dialog open={openForm === 'sprint'} onClose={handleClose}>
        <SprintForm onSubmit={handleSprintSubmit} onClose={handleClose} projects={projects} />
      </Dialog>

      <Dialog open={openForm === 'task'} onClose={handleClose}>
        <TaskForm onSubmit={handleTaskSubmit} onClose={handleClose} projects={projects} sprints={sprints} />
      </Dialog>
    </>
  );
}
