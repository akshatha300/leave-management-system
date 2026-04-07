import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Decorative background elements for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <Navbar />
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
