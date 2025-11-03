import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

export default function Topbar({ pageTitle, toggleSidebar }) {
  const { auth, logout } = useAuth();

  return (
    <nav
      id="app-topbar"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between
                 bg-primary-medium/80 px-4 shadow-glass backdrop-blur-md 
                 border-b border-primary-light/50 md:px-8"
    >
      <div className="flex items-center">
        {/* Burger menu button */}
        <button
          onClick={toggleSidebar}
          className="mr-4 text-2xl text-gray-400 hover:text-white"
        >
          <i className="ri-menu-2-line"></i>
        </button>

        {/* Page Title */}
        <h1 className="text-xl font-display font-semibold text-white">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Badge */}
        <div className="flex items-center space-x-2">
          <span className="hidden text-sm text-gray-300 md:block">
            {auth?.email}
          </span>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full 
                       bg-gradient-to-br from-accent-violet to-accent-pink"
          >
            <span className="font-semibold text-white">
              {auth?.email?.[0].toUpperCase() || 'A'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="!border-accent-pink/50 !text-accent-pink hover:!bg-accent-pink/10"
        >
          <i className="ri-logout-box-r-line mr-2"></i>
          Logout
        </Button>
      </div>
    </nav>
  );
}