import ThemeToggle from '@/components/shared/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const Settings = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="common-container">
      <div className="user-container space-y-8" style={{ alignItems: 'normal'}}>
        <h2 className="h3-bold md:h2-bold text-left w-full">Settings</h2>

        {/* Mode Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-left w-full">Mode</h1>
          <ThemeToggle />
        </div>

        {/* Language Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-left w-full">Choose Language</h1>
          {/* Placeholder for language dropdown */}
          <div className={`p-2 rounded-md w-40 text-center ${isDarkMode ? 'bg-dark-4 text-light-1' : 'bg-light-2 text-dark-1'}`}>English</div>
        </div>

        {/* Notifications Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-left w-full">Notifications</h1>
          {/* Placeholder for notifications toggle */}
          <div className={`p-2 rounded-md w-40 text-center ${isDarkMode ? 'bg-dark-4 text-light-1' : 'bg-light-2 text-dark-1'}`}>Enabled</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
