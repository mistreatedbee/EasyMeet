import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PhoneIcon, VideoIcon, MenuIcon, XIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Minimal nav on any meeting-flow route (parameterised paths too)
  const isMinimal =
    location.pathname.startsWith('/join/') ||
    location.pathname.startsWith('/waiting/') ||
    location.pathname.startsWith('/meeting/');

  const handleJoin = () => {
    const code = joinCode.trim();
    if (!code) return;
    setShowJoinInput(false);
    setJoinCode('');
    setIsMobileMenuOpen(false);
    navigate(`/join/${code}`);
  };

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

          {/* Desktop Nav */}
          {!isMinimal && (
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <Link to="/#how-it-works" className="text-lg font-medium text-ink-secondary hover:text-primary transition-colors">
                  How it Works
                </Link>
                <Link to="/help" className="text-lg font-medium text-ink-secondary hover:text-primary transition-colors">
                  Help Center
                </Link>
              </nav>
              <div className="flex items-center gap-4 relative">
                {/* Join Meeting with inline code input */}
                <div className="relative">
                  <Button
                    variant="success"
                    size="md"
                    icon={<PhoneIcon size={20} />}
                    onClick={() => setShowJoinInput((v) => !v)}>
                    Join Meeting
                  </Button>
                  <AnimatePresence>
                    {showJoinInput && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-border p-4 z-50">
                        <p className="text-sm font-semibold text-ink-primary mb-2">Enter meeting code</p>
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            type="text"
                            placeholder="e.g. abc123xyz"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            className="flex-grow h-10 px-3 rounded-lg border-2 border-border focus:outline-none focus:border-primary text-sm"
                          />
                          <button
                            onClick={handleJoin}
                            disabled={!joinCode.trim()}
                            className="h-10 px-3 bg-secondary text-white rounded-lg disabled:opacity-40 hover:bg-secondary-dark transition-colors">
                            <ArrowRightIcon size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/admin/login" tabIndex={-1}>
                  <Button variant="outline" size="md">Teacher Sign In</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Minimal nav help link */}
          {isMinimal && (
            <Link to="/help" className="text-lg font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
              Need Help?
            </Link>
          )}

          {/* Mobile menu toggle */}
          {!isMinimal && (
            <button
              className="md:hidden p-2 text-ink-primary hover:bg-muted rounded-xl focus-visible:ring-4 focus-visible:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu">
              {isMobileMenuOpen ? <XIcon size={32} /> : <MenuIcon size={32} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!isMinimal && isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border p-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          <Link to="/#how-it-works" className="text-xl font-medium text-ink-primary p-4 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
            How it Works
          </Link>
          <Link to="/help" className="text-xl font-medium text-ink-primary p-4 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
            Help Center
          </Link>
          <div className="h-px bg-border my-2" />

          {/* Mobile join with code */}
          <div className="flex gap-2 px-1">
            <input
              type="text"
              placeholder="Enter meeting code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="flex-grow h-12 px-4 rounded-xl border-2 border-border focus:outline-none focus:border-primary text-base"
            />
            <button
              onClick={handleJoin}
              disabled={!joinCode.trim()}
              className="h-12 px-4 bg-secondary text-white rounded-xl disabled:opacity-40">
              <ArrowRightIcon size={20} />
            </button>
          </div>
          <Button variant="success" fullWidth icon={<PhoneIcon size={24} />} onClick={handleJoin} disabled={!joinCode.trim()}>
            Join Meeting
          </Button>

          <Link to="/admin/login" tabIndex={-1} onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" fullWidth>Teacher Sign In</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
