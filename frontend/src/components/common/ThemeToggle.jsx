import { useTheme } from '../../context/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full transition-all duration-300 ease-in-out
        bg-background-hover hover:bg-background-accent
        border border-border-primary hover:border-border-accent
        focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50
        ${className}
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <MdLightMode 
          className={`
            absolute inset-0 w-5 h-5 text-text-accent transition-all duration-300
            ${isDark ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
        />
        <MdDarkMode 
          className={`
            absolute inset-0 w-5 h-5 text-text-accent transition-all duration-300
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
