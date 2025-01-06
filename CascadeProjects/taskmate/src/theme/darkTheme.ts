import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify green
      dark: '#1aa34a',
      light: '#1ed760',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#535353',
      dark: '#404040',
      light: '#666666',
    },
    background: {
      default: '#121212', // Spotify dark background
      paper: '#181818', // Spotify card background
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    divider: '#282828',
    error: {
      main: '#f15e6c',
    },
    warning: {
      main: '#ffa42b',
    },
    success: {
      main: '#1DB954',
    },
  },
  typography: {
    fontFamily: [
      'Circular',
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500,
          textTransform: 'none',
          fontWeight: 700,
          padding: '8px 32px',
        },
        contained: {
          '&:hover': {
            transform: 'scale(1.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          '&:hover': {
            backgroundColor: '#282828',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:hover': {
            backgroundColor: '#282828',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
});

// Add custom scrollbar styles
const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: #121212;
  }
  ::-webkit-scrollbar-thumb {
    background: #535353;
    border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #666666;
  }
`;

// Add scrollbar styles to document
const style = document.createElement('style');
style.textContent = scrollbarStyles;
document.head.appendChild(style);
