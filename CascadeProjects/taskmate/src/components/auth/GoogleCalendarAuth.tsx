import { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { googleCalendarService } from '../../services/googleCalendar';

export function GoogleCalendarAuth() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGoogleCalendar = async () => {
      try {
        await googleCalendarService.initialize();
      } catch (err) {
        setError('Failed to initialize Google Calendar');
        console.error('Failed to initialize Google Calendar:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeGoogleCalendar();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await googleCalendarService.authorize();
    } catch (err) {
      setError('Failed to connect to Google Calendar');
      console.error('Failed to connect to Google Calendar:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isInitializing) {
    return <CircularProgress size={24} />;
  }

  return (
    <Button
      variant="outlined"
      onClick={handleConnect}
      disabled={isConnecting}
      color={error ? 'error' : 'primary'}
      sx={{ borderRadius: 50, textTransform: 'none' }}
    >
      {isConnecting ? (
        <>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          Connecting...
        </>
      ) : error ? (
        'Retry Connection'
      ) : (
        'Connect Google Calendar'
      )}
    </Button>
  );
}
