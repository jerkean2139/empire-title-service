import { google } from 'googleapis';

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

class GoogleCalendarService {
  private clientId: string;
  private redirectUri: string;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private accessToken: string | null = null;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  }

  async initialize() {
    if (typeof window === 'undefined') return;

    await this.loadGapiScript();
    await this.loadGsiScript();
    await this.initializeGapi();
    this.initializeTokenClient();
  }

  private async loadGapiScript(): Promise<void> {
    if (typeof window.gapi !== 'undefined') return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GAPI script'));
      document.head.appendChild(script);
    });
  }

  private async loadGsiScript(): Promise<void> {
    if (typeof window.google !== 'undefined') return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GSI script'));
      document.head.appendChild(script);
    });
  }

  private async initializeGapi(): Promise<void> {
    if (!window.gapi) throw new Error('GAPI not loaded');

    return new Promise((resolve, reject) => {
      window.gapi.load('client', {
        callback: async () => {
          try {
            await window.gapi.client.init({});
            await window.gapi.client.load('calendar', 'v3');
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        onerror: () => reject(new Error('Failed to load GAPI client')),
      });
    });
  }

  private initializeTokenClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
      callback: (response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        this.accessToken = response.access_token;
      },
    });
  }

  async authorize(): Promise<void> {
    if (!this.tokenClient) {
      throw new Error('Token client not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient!.callback = (response) => {
          if (response.error) {
            reject(response.error);
          } else {
            this.accessToken = response.access_token;
            resolve();
          }
        };
        this.tokenClient!.requestAccessToken();
      } catch (error) {
        reject(error);
      }
    });
  }

  async listEvents(timeMin: Date, timeMax: Date): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      throw new Error('Not authorized');
    }

    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.result.items;
  }

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    if (!this.accessToken) {
      throw new Error('Not authorized');
    }

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.result;
  }

  async updateEvent(eventId: string, event: CalendarEvent): Promise<CalendarEvent> {
    if (!this.accessToken) {
      throw new Error('Not authorized');
    }

    const response = await window.gapi.client.calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: event,
    });

    return response.result;
  }

  async deleteEvent(eventId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authorized');
    }

    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }

  async findAvailableSlots(
    timeMin: Date,
    timeMax: Date,
    duration: number // in minutes
  ): Promise<{ start: Date; end: Date }[]> {
    const events = await this.listEvents(timeMin, timeMax);
    const busySlots = events.map(event => ({
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    }));

    const availableSlots: { start: Date; end: Date }[] = [];
    let currentTime = new Date(timeMin);

    while (currentTime < timeMax) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);
      
      // Check if slot is within working hours (9 AM to 5 PM)
      const isWorkingHours = 
        currentTime.getHours() >= 9 && 
        slotEnd.getHours() < 17;

      // Check if slot conflicts with any existing events
      const hasConflict = busySlots.some(
        slot => 
          (currentTime >= slot.start && currentTime < slot.end) ||
          (slotEnd > slot.start && slotEnd <= slot.end)
      );

      if (isWorkingHours && !hasConflict) {
        availableSlots.push({
          start: new Date(currentTime),
          end: slotEnd,
        });
      }

      // Move to next 30-minute slot
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return availableSlots;
  }
}

// Create a singleton instance
export const googleCalendarService = new GoogleCalendarService();

// Add type declarations for the window object
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
