import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  School as EducationIcon,
  Stars as MasteryIcon,
  Timeline as ProgressIcon,
  Lock as LockedIcon,
  LockOpen as UnlockedIcon,
  Psychology as SkillIcon,
  EmojiEvents as AchievementIcon,
  WorkspacePremium as PremiumIcon,
  Whatshot as PowerIcon,
  Build as ToolIcon,
} from '@mui/icons-material';

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  category: SkillCategory;
  prerequisites: string[];
  unlocks: string[];
  progress: number;
  status: 'locked' | 'available' | 'mastered';
  benefits: string[];
  icon: string;
}

type SkillCategory =
  | 'productivity'
  | 'leadership'
  | 'technical'
  | 'collaboration'
  | 'innovation';

interface SkillNode {
  skill: Skill;
  position: {
    x: number;
    y: number;
  };
  connections: string[];
}

interface Props {
  skills: Skill[];
  userPoints: number;
  onUpgradeSkill: (skillId: string) => void;
  onResetSkills: () => void;
}

export default function SkillTree({
  skills,
  userPoints,
  onUpgradeSkill,
  onResetSkills,
}: Props) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);

  useEffect(() => {
    // Generate skill tree layout
    const nodes = generateSkillTreeLayout(skills);
    setSkillNodes(nodes);
  }, [skills]);

  const generateSkillTreeLayout = (skills: Skill[]): SkillNode[] => {
    // This is a simplified layout algorithm
    // In a real implementation, you'd want a more sophisticated force-directed graph
    const nodes: SkillNode[] = [];
    const levelGroups: { [key: number]: Skill[] } = {};

    // Group skills by their level requirements
    skills.forEach(skill => {
      const level = Math.min(...skill.prerequisites.map(
        p => skills.find(s => s.id === p)?.level || 0
      )) + 1;
      
      if (!levelGroups[level]) {
        levelGroups[level] = [];
      }
      levelGroups[level].push(skill);
    });

    // Position nodes in a tree-like structure
    Object.entries(levelGroups).forEach(([level, groupSkills], levelIndex) => {
      const y = levelIndex * 150;
      groupSkills.forEach((skill, skillIndex) => {
        const x = (skillIndex - (groupSkills.length - 1) / 2) * 200;
        nodes.push({
          skill,
          position: { x, y },
          connections: skill.prerequisites,
        });
      });
    });

    return nodes;
  };

  const renderSkillNode = (node: SkillNode) => {
    const { skill, position } = node;

    return (
      <g
        transform={`translate(${position.x},${position.y})`}
        onClick={() => {
          setSelectedSkill(skill);
          setShowSkillDialog(true);
        }}
        style={{ cursor: 'pointer' }}
      >
        {/* Connections */}
        {node.connections.map(targetId => {
          const targetNode = skillNodes.find(n => n.skill.id === targetId);
          if (targetNode) {
            return (
              <line
                key={`${skill.id}-${targetId}`}
                x1={0}
                y1={0}
                x2={targetNode.position.x - position.x}
                y2={targetNode.position.y - position.y}
                stroke={skill.status === 'locked' ? '#ccc' : '#2196f3'}
                strokeWidth={2}
              />
            );
          }
          return null;
        })}

        {/* Node circle */}
        <circle
          r={30}
          fill={
            skill.status === 'mastered' ? '#4caf50' :
            skill.status === 'available' ? '#2196f3' :
            '#9e9e9e'
          }
          stroke={skill.status === 'locked' ? '#ccc' : '#fff'}
          strokeWidth={2}
        />

        {/* Skill icon */}
        <text
          textAnchor="middle"
          dy=".3em"
          fill="#fff"
          style={{ fontSize: '20px' }}
        >
          {skill.icon}
        </text>

        {/* Skill name */}
        <text
          y={45}
          textAnchor="middle"
          fill="#000"
          style={{ fontSize: '12px' }}
        >
          {skill.name}
        </text>

        {/* Level indicator */}
        <text
          y={-40}
          textAnchor="middle"
          fill="#000"
          style={{ fontSize: '12px' }}
        >
          Lv.{skill.level}/{skill.maxLevel}
        </text>
      </g>
    );
  };

  const renderSkillTree = () => (
    <svg
      width="100%"
      height="800"
      viewBox="-400 -100 800 600"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(400,100)">
        {skillNodes.map(node => renderSkillNode(node))}
      </g>
    </svg>
  );

  const renderSkillDialog = () => (
    <Dialog
      open={showSkillDialog}
      onClose={() => setShowSkillDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedSkill && (
        <>
          <DialogTitle>
            <Stack direction="row" spacing={2} alignItems="center">
              <SkillIcon color="primary" />
              <Typography variant="h6">
                {selectedSkill.name}
              </Typography>
              <Chip
                label={`Level ${selectedSkill.level}/${selectedSkill.maxLevel}`}
                color={
                  selectedSkill.status === 'mastered' ? 'success' :
                  selectedSkill.status === 'available' ? 'primary' :
                  'default'
                }
              />
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              {/* Description */}
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    {selectedSkill.description}
                  </Typography>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      Skill Progress
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Level {selectedSkill.level} Progress
                        </Typography>
                        <Typography variant="body2">
                          {selectedSkill.progress}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={selectedSkill.progress}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Prerequisites
                  </Typography>
                  <List>
                    {selectedSkill.prerequisites.map(prereqId => {
                      const prereq = skills.find(s => s.id === prereqId);
                      return (
                        <ListItem key={prereqId}>
                          <ListItemIcon>
                            {prereq?.status === 'mastered' ? (
                              <UnlockedIcon color="success" />
                            ) : (
                              <LockedIcon color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={prereq?.name}
                            secondary={`Level ${prereq?.level}/${prereq?.maxLevel}`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skill Benefits
                  </Typography>
                  <List>
                    {selectedSkill.benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <PowerIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Unlocks */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Unlocks
                  </Typography>
                  <List>
                    {selectedSkill.unlocks.map(unlockId => {
                      const unlock = skills.find(s => s.id === unlockId);
                      return (
                        <ListItem key={unlockId}>
                          <ListItemIcon>
                            <ToolIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={unlock?.name}
                            secondary={unlock?.description}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            Skill Tree
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<MasteryIcon />}
              label={`${userPoints} Skill Points`}
              color="primary"
            />
            <Button
              variant="outlined"
              startIcon={<EducationIcon />}
              onClick={() => onResetSkills()}
            >
              Reset Skills
            </Button>
          </Stack>
        </Stack>

        {/* Skill Categories */}
        <Stack direction="row" spacing={2}>
          {['productivity', 'leadership', 'technical', 'collaboration', 'innovation'].map(
            category => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => {/* Add filter logic */}}
              />
            )
          )}
        </Stack>

        {/* Skill Tree Visualization */}
        <Card>
          <CardContent>
            {renderSkillTree()}
          </CardContent>
        </Card>

        {renderSkillDialog()}
      </Stack>
    </Box>
  );
}
