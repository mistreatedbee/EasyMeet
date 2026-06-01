import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, VideoIcon } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-3 mb-6 inline-flex focus-visible:ring-4 focus-visible:ring-primary rounded-lg p-1">
              
              <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center">
                <PhoneIcon size={24} className="mr-[-6px] z-10" />
                <VideoIcon size={20} className="opacity-80" />
              </div>
              <span className="text-2xl font-bold text-ink-primary tracking-tight">
                EasyMeet
              </span>
            </Link>
            <p className="text-xl text-ink-secondary max-w-md">
              Join a meeting as easily as answering a phone call. Designed for
              everyone, especially those who find technology frustrating.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-ink-primary mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/join"
                  className="text-lg text-ink-secondary hover:text-primary transition-colors">
                  
                  Join a Meeting
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/create"
                  className="text-lg text-ink-secondary hover:text-primary transition-colors">
                  
                  Create a Meeting
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-lg text-ink-secondary hover:text-primary transition-colors">
                  
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-ink-primary mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="text-lg text-ink-secondary">
                <span className="block font-medium text-ink-primary">
                  Phone Support:
                </span>
                1-800-EASY-MEET
              </li>
              <li className="text-lg text-ink-secondary">
                <span className="block font-medium text-ink-primary">
                  Email:
                </span>
                help@easymeet.example.com
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ink-secondary text-lg">
            © {new Date().getFullYear()} EasyMeet. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-ink-secondary hover:text-primary text-lg">
              
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-ink-secondary hover:text-primary text-lg">
              
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>);

}