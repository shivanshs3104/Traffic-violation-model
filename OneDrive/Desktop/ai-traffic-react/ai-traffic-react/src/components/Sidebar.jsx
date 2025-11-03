import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useViolations } from '../context/ViolationsContext';
import { APP_TITLE, ROUTES } from '../lib/constants';

// Sidebar navigation items
const navItems = [
  { name: 'Dashboard', icon: 'ri-dashboard-line', path: ROUTES.DASHBOARD },
  {
    name: 'Violations',
    icon: 'ri-alarm-warning-line',
    path: ROUTES.VIOLATIONS,
    submenu: [
      { name: 'All', typeFilter: null },
      { name: 'Overspeeding', typeFilter: 'Overspeeding' },
      { name: 'Red Light Jump', typeFilter: 'Red Light Jump' },
      { name: 'No Helmet', typeFilter: 'No Helmet' },
      { name: 'Wrong Lane', typeFilter: 'Wrong Lane' },
    ],
  },
  { name: 'Analysis', icon: 'ri-line-chart-line', path: ROUTES.ANALYSIS },
  { name: 'Reports', icon: 'ri-file-chart-line', path: ROUTES.REPORTS },
];

export default function Sidebar({ isCollapsed, setCollapsed }) {
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const { activeTypeFilter, setActiveTypeFilter } = useViolations();
  const navigate = useNavigate();

  // Handle main navigation clicks
  const handleNavClick = (item) => {
    if (item.submenu) {
      // Toggle submenu only for 'Violations'
      setSubmenuOpen(!isSubmenuOpen);
      // Don't navigate, let submenu handle it
    } else {
      // Close submenu when clicking other items
      setSubmenuOpen(false);
      setActiveTypeFilter(null); // Reset type filter
      navigate(item.path);
    }
  };

  // Handle submenu item clicks
  const handleSubmenuClick = (submenuItem) => {
    setActiveTypeFilter(submenuItem.typeFilter);
    // Ensure we are on the violations page
    navigate(ROUTES.VIOLATIONS);
  };

  // Close submenu when sidebar collapses
  if (isCollapsed && isSubmenuOpen) {
    setSubmenuOpen(false);
  }

  return (
    <aside
      id="app-sidebar"
      className={clsx(
        'fixed top-0 left-0 z-40 h-screen bg-primary-medium transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[84px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        {/* Logo/Title */}
        <div
          className={clsx(
            'flex items-center mb-6 h-14 px-3',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <i className="ri-camera-lens-line text-accent-violet text-3xl"></i>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-display font-semibold text-white whitespace-nowrap">
              {APP_TITLE}
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              {/* Main Nav Item */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                className={clsx(
                  'flex items-center p-3 text-gray-300 rounded-lg hover:bg-primary-light hover:text-white group',
                  !item.submenu &&
                    window.location.pathname === item.path &&
                    'bg-accent-violet text-white', // Active state for non-submenu items
                  isCollapsed && 'justify-center'
                )}
              >
                <i className={clsx(item.icon, 'text-2xl')}></i>
                {!isCollapsed && (
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                {!isCollapsed && item.submenu && (
                  <i
                    className={clsx(
                      'ri-arrow-down-s-line transition-transform duration-200',
                      isSubmenuOpen && 'rotate-180'
                    )}
                  ></i>
                )}
              </a>

              {/* Submenu */}
              {!isCollapsed && item.submenu && isSubmenuOpen && (
                <ul className="py-2 space-y-2 pl-8">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.name}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmenuClick(subItem);
                        }}
                        className={clsx(
                          'flex items-center w-full p-2 text-gray-400 transition duration-75 rounded-lg group hover:bg-primary-light hover:text-white',
                          activeTypeFilter === subItem.typeFilter &&
                            'text-accent-cyan font-semibold'
                        )}
                      >
                        {subItem.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}