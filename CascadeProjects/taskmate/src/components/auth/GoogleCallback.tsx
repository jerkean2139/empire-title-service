import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { googleCalendarService } from '../../services/googleCalendar';

export function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      if (code) {
        try {
          await googleCalendarService.authorize(code);
          // Send message to opener window
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_CALLBACK',
              code,
            }, window.location.origin);
            window.close();
          } else {
            // If not opened in popup, redirect back to dashboard
            navigate('/');
          }
        } catch (error) {
          console.error('Failed to authorize:', error);
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Connecting to Google Calendar...</Typography>
    </Box>
  );
}
