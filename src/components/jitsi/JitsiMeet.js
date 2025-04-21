import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import MeetingSetupModal from './MeetingSetupModal.js';

const JitsiMeet = () => {
  const jitsiContainer = useRef(null);
  const apiRef = useRef(null);
  const { user } = useUser();
  const [showSetup, setShowSetup] = useState(true);
  const [meetingConfig, setMeetingConfig] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/jitsi-token');
        const data = await response.json();
        setJwtToken(data.token);
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!meetingConfig) return; // Don't initialize until meeting is configured

    if (!jitsiContainer.current) {
      console.error('Container ref is not available');
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="external_api.js"]');
    if (existingScript) {
      initJitsi();
      return;
    }

    // Load the external API script if it doesn't exist
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-a5e4c5c22e40476b8b20881050f2412f/external_api.js';
    script.async = true;
    
    script.onerror = (error) => {
      console.error('Error loading Jitsi script:', error);
    };

    script.onload = initJitsi;
    document.body.appendChild(script);

    return () => {
      if (apiRef.current) {
        console.log('Disposing Jitsi API');
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [user, meetingConfig]);

  const initJitsi = () => {
    try {
      if (!window.JitsiMeetExternalAPI) {
        console.error('JitsiMeetExternalAPI not found');
        return;
      }

      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }

      console.log('Initializing Jitsi with container:', jitsiContainer.current);
      
      const roomName = `${meetingConfig.projectId}-${meetingConfig.meetingName.replace(/\s+/g, '-')}`;
      
      apiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", {
        roomName: roomName,
        parentNode: jitsiContainer.current,
        jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtYTVlNGM1YzIyZTQwNDc2YjhiMjA4ODEwNTBmMjQxMmYvZmU1NGEzLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDUyMDAwMjAsImV4cCI6MTc0NTIwNzIyMCwibmJmIjoxNzQ1MjAwMDE1LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtYTVlNGM1YzIyZTQwNDc2YjhiMjA4ODEwNTBmMjQxMmYiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImptZWZmZXJ0IiwiaWQiOiJnb29nbGUtb2F1dGgyfDEwMTk5MTgzNzE3MjU0OTg4NTM1NCIsImF2YXRhciI6IiIsImVtYWlsIjoiam1lZmZlcnRAY2hhcmxvdHRlLmVkdSJ9fSwicm9vbSI6IioifQ.d5QlxmLHG4l29chWztydG4cxzRArNhHFGOP7-qvlakWFZvRbyEs3gFTwuzC3U_ZPzAHvbgUikADB1Po3Cww0M6EXuNa8c8wkP4UkeiD8q3BiUlpa-6BDM07RkM4uyM-6abYd_JtQM8l86skGeVF9GyFn08OGxu7SGhJlRyzx6WrVKs-zC3KNI8j_zkeWQWwVjrxhr1I1ONYxgeOSjEXQmV1HP3YRCWmYF2knt-DK5g0rA8G5ttR4Ry2DmSKzLo_Q3HNFAQU1gG2gOiAwPzN2dteKldMRy64hRKkE4bnUGdSFHDi-VYkL5VPyPvZruFuB2D9NN5CF52PjogwmPquqLw", // Add your JWT token here
        userInfo: {
          displayName: user?.fullName || 'Guest',
          email: user?.primaryEmailAddress?.emailAddress || '',
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          fileRecordingsEnabled: true,
          fileRecordingsServiceEnabled: true,
          fileRecordingsServiceSharingEnabled: true,
          liveStreamingEnabled: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
          TOOLBAR_ALWAYS_VISIBLE: true,
        },
        height: '100%',
        width: '100%',
      });

      // Add event listeners for recording
      apiRef.current.addEventListener('recordingStatusChanged', ({ status }) => {
        console.log('Recording status:', status);
      });

      apiRef.current.addEventListener('videoConferenceJoined', () => {
        console.log('User has joined the conference');
      });

      apiRef.current.addEventListener('videoConferenceLeft', () => {
        console.log('User has left the conference');
      });

    } catch (error) {
      console.error('Error initializing Jitsi:', error);
    }
  };

  const handleStartMeeting = (config) => {
    setMeetingConfig(config);
    setShowSetup(false);
  };

  if (showSetup) {
    return (
      <MeetingSetupModal
        isOpen={true}
        onClose={() => setShowSetup(false)}
        onStart={handleStartMeeting}
      />
    );
  }

  return (
    <div className="h-full w-full">
      <div 
        ref={jitsiContainer} 
        className="h-[calc(100vh-64px)] w-full"
        id="jitsi-container"
      />
    </div>
  );
};

export default JitsiMeet; 