export const theme = {
  colors: {
    primary: '#FFFF00', // Neon yellow
    primaryHover: '#FFFF33', // Slightly lighter neon yellow
    secondary: '#FFFFFF', // White
    background: {
      dark: '#000000', // Black
      light: '#121212', // Slightly lighter black for depth
      card: '#1A1A1A', // Even lighter black for cards
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#CCCCCC', // Light gray text
      accent: '#FFFF00', // Neon yellow for emphasis
    },
    border: {
      light: '#333333', // Light border
      accent: '#FFFF00', // Neon yellow border
    }
  },
  shadows: {
    neon: '0 0 10px #FFFF00, 0 0 20px #FFFF00, 0 0 30px #FFFF00',
    subtle: '0 2px 4px rgba(255, 255, 0, 0.1)',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
  }
}; 