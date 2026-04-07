import { Bell, Menu, Search, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { toggleSidebar, setTheme } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const cycleTheme = () => {
    if (theme === 'light') dispatch(setTheme('dark'));
    else if (theme === 'dark') dispatch(setTheme('system'));
    else dispatch(setTheme('light'));
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-6 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full pl-9 bg-muted/50 border-none transition-colors focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button variant="ghost" size="icon" onClick={cycleTheme} className="text-muted-foreground hover:text-foreground">
          {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-card"></span>
          </Button>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 ml-2 cursor-pointer hover:bg-primary/30 transition-colors"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="text-sm font-medium text-primary">{getInitials(user?.name)}</span>
          </div>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-card border rounded-md shadow-lg py-2 z-50">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="px-4 py-2">
                <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium text-right">{user?.role}</span>
                  {user?.department && (
                    <>
                      <span className="text-muted-foreground">Dept:</span>
                      <span className="font-medium text-right truncate">{user?.department}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="border-t border-border/50 pt-1 mt-1">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
