import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  PlusCircleIcon,
  CalendarIcon,
  ListIcon,
  VideoIcon,
  BarChart2Icon,
  SettingsIcon,
  HelpCircleIcon,
  MenuIcon,
  XIcon,
  PhoneIcon,
  LogOutIcon } from
'lucide-react';
import { cn } from '../../utils/cn';
export function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon size={24} />
  },
  {
    path: '/admin/create',
    label: 'Create Meeting',
    icon: <PlusCircleIcon size={24} />
  },
  {
    path: '/admin/schedule',
    label: 'Schedule',
    icon: <CalendarIcon size={24} />
  },
  {
    path: '/admin/meetings',
    label: 'Manage Meetings',
    icon: <ListIcon size={24} />
  },
  {
    path: '/admin/recordings',
    label: 'Recordings',
    icon: <VideoIcon size={24} />
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: <BarChart2Icon size={24} />
  },
  {
    path: '/admin/control',
    label: 'Control Panel',
    icon: <SettingsIcon size={24} />
  }];

  const SidebarContent = () =>
  <div className="flex flex-col h-full bg-white border-r border-border">
      <div className="p-6 border-b border-border">
        <Link
        to="/"
        className="flex items-center gap-3 focus-visible:ring-4 focus-visible:ring-primary rounded-lg p-1">
        
          <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center">
            <PhoneIcon size={24} className="mr-[-6px] z-10" />
            <VideoIcon size={20} className="opacity-80" />
          </div>
          <span className="text-2xl font-bold text-ink-primary tracking-tight">
            EasyMeet
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-colors focus-visible:ring-4 focus-visible:ring-primary',
              isActive ?
              'bg-primary/10 text-primary' :
              'text-ink-secondary hover:bg-muted hover:text-ink-primary'
            )}>
            
              {item.icon}
              {item.label}
            </Link>);

      })}

        <div className="h-px bg-border my-6 mx-4" />

        <Link
        to="/help"
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium text-ink-secondary hover:bg-muted hover:text-ink-primary transition-colors focus-visible:ring-4 focus-visible:ring-primary">
        
          <HelpCircleIcon size={24} />
          Help Center
        </Link>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold">
            S
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-base font-bold text-ink-primary truncate">
              Sarah Jenkins
            </div>
            <div className="text-sm text-ink-secondary truncate">
              sarah@example.com
            </div>
          </div>
          <LogOutIcon size={20} className="text-ink-secondary" />
        </div>
      </div>
    </div>;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0 fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b border-border z-30 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
            <PhoneIcon size={20} className="mr-[-4px] z-10" />
            <VideoIcon size={16} className="opacity-80" />
          </div>
          <span className="text-xl font-bold text-ink-primary">
            EasyMeet Admin
          </span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-ink-primary hover:bg-muted rounded-xl">
          
          {isMobileOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen &&
      <div
        className="lg:hidden fixed inset-0 z-20 bg-black/50"
        onClick={() => setIsMobileOpen(false)}>
        
          <div
          className="absolute inset-y-0 left-0 w-[280px] bg-white"
          onClick={(e) => e.stopPropagation()}>
          
            <SidebarContent />
          </div>
        </div>
      }

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] pt-20 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>);

}