import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import clsx from 'clsx';

// Map routes to titles
const routeTitles = {
  '/dashboard': 'Dashboard',
  '/violations': 'All Violations',
  '/analysis': 'Data Analysis',
  '/reports': 'Reports & Exports',
};

export default function AppLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    return routeTitles[location.pathname] || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-primary-dark">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main
        id="main-content"
        className={clsx(
          'flex-1 flex-col transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'ml-[84px]' : 'ml-[260px]'
        )}
      >
        <Topbar
          pageTitle={getTitle()}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="p-4 md:p-8 bg-primary-dark">
          {/* This is where the nested routes will render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}