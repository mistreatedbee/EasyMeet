import React from 'react';
import { HelpCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export function FloatingHelpButton() {
  return (
    <Link
      to="/help"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white text-ink-primary px-6 py-4 rounded-full shadow-lg border border-border hover:border-primary hover:text-primary transition-all focus-visible:ring-4 focus-visible:ring-primary group"
      aria-label="Need help?">
      
      <HelpCircleIcon
        size={28}
        className="text-primary group-hover:scale-110 transition-transform" />
      
      <span className="text-xl font-bold">Need help?</span>
    </Link>);

}