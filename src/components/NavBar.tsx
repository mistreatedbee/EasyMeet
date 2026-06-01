import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon, VideoIcon, MenuIcon, XIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';
export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMinimal = ['/join', '/waiting', '/meeting'].includes(
    location.pathname
  );
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 focus-visible:ring-4 focus-visible:ring-primary rounded-lg p-1">
            
            <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center">
              <PhoneIcon size={28} className="mr-[-8px] z-10" />
              <VideoIcon size={24} className="opacity-80" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              EasyMeet
            </span>
          </Link>

          {/* Desktop Nav - Hidden on minimal routes */}
          {!isMinimal &&
          <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <Link
                to="/#how-it-works"
                className="text-lg font-medium text-ink-secondary hover:text-primary transition-colors">
                
                  How it Works
                </Link>
                <Link
                to="/help"
                className="text-lg font-medium text-ink-secondary hover:text-primary transition-colors">
                
                  Help Center
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                <Link to="/join" tabIndex={-1}>
                  <Button
                  variant="success"
                  size="md"
                  icon={<PhoneIcon size={20} />}>
                  
                    Join Meeting
                  </Button>
                </Link>
                <Link to="/admin" tabIndex={-1}>
                  <Button variant="outline" size="md">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          }

          {/* Minimal Nav Help Link */}
          {isMinimal &&
          <Link
            to="/help"
            className="text-lg font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
            
              Need Help?
            </Link>
          }

          {/* Mobile Menu Button - Hidden on minimal routes */}
          {!isMinimal &&
          <button
            className="md:hidden p-2 text-ink-primary hover:bg-muted rounded-xl focus-visible:ring-4 focus-visible:ring-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu">
            
              {isMobileMenuOpen ? <XIcon size={32} /> : <MenuIcon size={32} />}
            </button>
          }
        </div>
      </div>

      {/* Mobile Menu */}
      {!isMinimal && isMobileMenuOpen &&
      <div className="md:hidden bg-white border-b border-border p-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          <Link
          to="/#how-it-works"
          className="text-xl font-medium text-ink-primary p-4 hover:bg-muted rounded-xl"
          onClick={() => setIsMobileMenuOpen(false)}>
          
            How it Works
          </Link>
          <Link
          to="/help"
          className="text-xl font-medium text-ink-primary p-4 hover:bg-muted rounded-xl"
          onClick={() => setIsMobileMenuOpen(false)}>
          
            Help Center
          </Link>
          <div className="h-px bg-border my-2" />
          <Link
          to="/join"
          tabIndex={-1}
          onClick={() => setIsMobileMenuOpen(false)}>
          
            <Button variant="success" fullWidth icon={<PhoneIcon size={24} />}>
              Join Meeting
            </Button>
          </Link>
          <Link
          to="/admin"
          tabIndex={-1}
          onClick={() => setIsMobileMenuOpen(false)}>
          
            <Button variant="outline" fullWidth>
              Sign In
            </Button>
          </Link>
        </div>
      }
    </header>);

}