import { Checkbox, FormControlLabel } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '@/context/ThemeContext'; // Adjust import based on your file structure

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center w-40">
      <FormControlLabel
        control={
          <Checkbox
            checked={isDarkMode}
            onChange={toggleTheme}
            icon={
              <WbSunnyIcon
                style={{ color: isDarkMode ? 'inherit' : '#FFD700' }} // Yellow color for sun in light mode
              />
            }
            checkedIcon={<DarkModeIcon />}
          />
        }
        label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
      />
    </div>
  );
};

export default ThemeToggle;
