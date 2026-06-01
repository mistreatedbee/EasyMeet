import React from 'react';
import {
  SearchIcon,
  PlayIcon,
  DownloadIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon } from
'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
export function Recordings() {
  const recordings = [
  {
    id: 1,
    title: 'Sunday Service',
    date: 'Oct 12, 2023',
    duration: '1h 45m',
    size: '1.2 GB',
    thumbnail: 'bg-gradient-to-br from-blue-400 to-indigo-600'
  },
  {
    id: 2,
    title: 'Board Meeting Q4',
    date: 'Oct 11, 2023',
    duration: '45m',
    size: '450 MB',
    thumbnail: 'bg-gradient-to-br from-emerald-400 to-teal-600'
  },
  {
    id: 3,
    title: 'Math Class - Grade 5',
    date: 'Oct 10, 2023',
    duration: '55m',
    size: '600 MB',
    thumbnail: 'bg-gradient-to-br from-amber-400 to-orange-600'
  },
  {
    id: 4,
    title: 'Weekly Staff Sync',
    date: 'Oct 8, 2023',
    duration: '30m',
    size: '250 MB',
    thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-600'
  },
  {
    id: 5,
    title: 'Parent Teacher Conf',
    date: 'Oct 5, 2023',
    duration: '2h 15m',
    size: '1.8 GB',
    thumbnail: 'bg-gradient-to-br from-rose-400 to-red-600'
  },
  {
    id: 6,
    title: 'Choir Practice',
    date: 'Oct 3, 2023',
    duration: '1h 10m',
    size: '850 MB',
    thumbnail: 'bg-gradient-to-br from-cyan-400 to-blue-600'
  }];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
            Recording Library
          </h1>
          <p className="text-xl text-ink-secondary">
            Watch, download, and share your past meetings.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-ink-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search recordings..." />
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recordings.map((rec) =>
        <Card key={rec.id} padding="none" className="flex flex-col group">
            <div
            className={`h-48 ${rec.thumbnail} relative flex items-center justify-center`}>
            
              <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                <PlayIcon size={32} className="ml-1" />
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm font-bold backdrop-blur-sm">
                {rec.duration}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-ink-primary mb-4 line-clamp-1">
                {rec.title}
              </h3>
              <div className="flex items-center gap-4 text-ink-secondary mb-6">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon size={16} />
                  <span className="text-sm font-medium">{rec.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon size={16} />
                  <span className="text-sm font-medium">{rec.size}</span>
                </div>
              </div>
              <div className="mt-auto flex gap-2 pt-4 border-t border-border">
                <Button
                variant="outline"
                size="md"
                className="flex-1 py-2 px-3 text-sm h-auto"
                icon={<DownloadIcon size={16} />}>
                
                  Download
                </Button>
                <Button
                variant="outline"
                size="md"
                className="flex-1 py-2 px-3 text-sm h-auto"
                icon={<ShareIcon size={16} />}>
                
                  Share
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>);

}