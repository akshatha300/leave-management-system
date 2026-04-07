import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { Home, Calendar, FileText, CheckSquare, Users, BarChart, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const navigateToLogin = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: `/${user.role.toLowerCase()}/dashboard`, icon: Home },
    ];

    if (user.role === 'Student') {
      baseItems.push(
        { name: 'Apply Leave', path: '/leave/apply', icon: FileText },
        { name: 'Leave History', path: '/leave/history', icon: Calendar }
      );
    } else if (user.role === 'Professor') {
      baseItems.push(
        { name: 'Approvals', path: '/leave/approvals', icon: CheckSquare },
        { name: 'Apply Leave', path: '/leave/apply', icon: FileText },
        { name: 'My History', path: '/leave/history', icon: Calendar }
      );
    } else if (user.role === 'HOD') {
      baseItems.push(
        { name: 'Approvals', path: '/leave/approvals', icon: CheckSquare },
        { name: 'Department Reports', path: '/department/reports', icon: BarChart },
        { name: 'Apply Leave', path: '/leave/apply', icon: FileText },
        { name: 'My History', path: '/leave/history', icon: Calendar }
      );
    } else if (user.role === 'Principal') {
      baseItems.push(
        { name: 'University Overview', path: '/principal/dashboard', icon: BarChart },
        { name: 'Pending Approvals', path: '/leave/approvals', icon: CheckSquare },
        { name: 'Manage Users', path: '/manage-users', icon: Users }
      );
    }

    baseItems.push({ name: 'Settings', path: '/settings', icon: Settings });
    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-card border-r hidden md:flex flex-col h-full">
      <div className="p-6 border-b flex-shrink-0">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">UMS Dash</h2>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t mt-auto flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.role}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={navigateToLogin} title="Logout">
            <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
