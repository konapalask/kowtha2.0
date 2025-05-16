export const colors = {
  // Primary Colors
  primary: {
    main: '#6377e7',
    light: '#8a9aef',
    dark: '#4a5db3',
    contrast: '#ffffff',
  },

  // Secondary Colors
  secondary: {
    main: '#e76377',
    light: '#ef8a9a',
    dark: '#b34a5d',
    contrast: '#ffffff',
  },

  // Accent Colors
  accent: {
    main: '#63e7b3',
    light: '#8aefc9',
    dark: '#4ab38a',
    contrast: '#ffffff',
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    gray50: '#fafafa',
    gray100: '#f5f5f5',
    gray200: '#eeeeee',
    gray300: '#e0e0e0',
    gray400: '#bdbdbd',
    gray500: '#9e9e9e',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },

  // Semantic Colors
  semantic: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },

  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    dark: '#212121',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9e9e9e',
    hint: '#9e9e9e',
  },

  // Border Colors
  border: {
    light: '#e0e0e0',
    main: '#bdbdbd',
    dark: '#9e9e9e',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    main: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
};

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getLighterColor = (color: string, amount: number): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`;
};

export const getDarkerColor = (color: string, amount: number): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
}; 