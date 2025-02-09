// Brand cursor styles and configurations
export const cursorStyles = {
  // Colors
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  
  // Sizes
  small: '12px',
  medium: '16px',
  large: '24px',
  
  // Animations
  transition: 'all 0.3s ease',
  
  // Cursor types
  default: {
    cursor: 'default'
  },
  pointer: {
    cursor: 'pointer'
  },
  text: {
    cursor: 'text'
  },
  loading: {
    cursor: 'wait'
  },
  
  // Custom cursors
  customPointer: {
    cursor: `url('path/to/custom-cursor.png'), auto`
  },
  
  // Hover effects
  hover: {
    scale: 1.1,
    transition: 'transform 0.2s ease'
  }
};

// Helper functions for cursor interactions
export const getCursorStyle = (type = 'default') => {
  return cursorStyles[type] || cursorStyles.default;
};

export const getHoverEffect = () => {
  return cursorStyles.hover;
}; 