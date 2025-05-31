
import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Server,
  Settings,
  CreditCard,
  BarChart3,
  Users,
  LogOut,
  User,
  Webhook
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Define sidebar menu items
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Server, label: 'Instance', path: '/instance' },
    { icon: CreditCard, label: 'Subscription', path: '/subscription' },
    { icon: User, label: 'Profile Details', path: '/me' },
    { icon: Webhook, label: 'Configuration', path: '/credentials' },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];
  
  // Admin-only menu items
  const adminMenuItems = [
    { icon: BarChart3, label: 'Admin Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Server, label: 'All Instances', path: '/admin/instances' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "bg-sidebar flex flex-col text-sidebar-foreground h-screen transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="font-bold text-xl text-sidebar-foreground">
              DevOps<span className="text-devops-blue">Wizard</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            )}
          </Button>
        </div>
        
        {/* User info */}
        <div className={cn(
          "flex items-center p-4 border-b border-sidebar-border",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-devops-blue flex items-center justify-center text-white font-semibold">
            {user?.name.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="ml-3 truncate">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.isAdmin ? 'Administrator' : 'User'}</p>
            </div>
          )}
        </div>
        
        {/* Menu items */}
        <nav className="flex-grow overflow-y-auto pt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path}
                  className="flex items-center px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                >
                  <item.icon size={20} />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
            
            {/* Admin section */}
            {user?.isAdmin && (
              <>
                {!collapsed && (
                  <li className="px-4 py-2 mt-4">
                    <p className="text-xs text-sidebar-foreground/60 uppercase font-semibold">Admin</p>
                  </li>
                )}
                {adminMenuItems.map((item, index) => (
                  <li key={`admin-${index}`}>
                    <Link 
                      to={item.path}
                      className="flex items-center px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                    >
                      <item.icon size={20} />
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={logout} 
            className={cn(
              "flex items-center text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors w-full",
              collapsed ? "justify-center" : "px-4 py-2"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow overflow-y-auto bg-background">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
