import React, { useState } from 'react';
import {
  SearchIcon,
  PlayIcon,
  CopyIcon,
  EditIcon,
  TrashIcon,
  MoreVerticalIcon } from
'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
export function ManageMeetings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'recurring'>(
    'upcoming'
  );
  const meetings = [
  {
    id: 1,
    title: 'Weekly Staff Sync',
    date: 'Oct 15, 2023',
    time: '9:00 AM',
    type: 'upcoming'
  },
  {
    id: 2,
    title: 'Parent Teacher Conf',
    date: 'Oct 16, 2023',
    time: '3:00 PM',
    type: 'upcoming'
  },
  {
    id: 3,
    title: 'Sunday Service',
    date: 'Oct 12, 2023',
    time: '10:00 AM',
    type: 'past'
  },
  {
    id: 4,
    title: 'Board Meeting Q4',
    date: 'Oct 11, 2023',
    time: '2:00 PM',
    type: 'past'
  },
  {
    id: 5,
    title: 'Math Class - Grade 5',
    date: 'Oct 10, 2023',
    time: '9:00 AM',
    type: 'past'
  },
  {
    id: 6,
    title: 'Daily Standup',
    date: 'Every Weekday',
    time: '10:00 AM',
    type: 'recurring'
  }];

  const filteredMeetings = meetings.filter((m) => m.type === activeTab);
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
            Manage Meetings
          </h1>
          <p className="text-xl text-ink-secondary">
            View and edit your scheduled and past meetings.
          </p>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto bg-muted p-1 rounded-xl">
            {(['upcoming', 'past', 'recurring'] as const).map((tab) =>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-lg font-bold capitalize transition-colors ${activeTab === tab ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary hover:text-ink-primary'}`}>
              
                {tab}
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-ink-secondary" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Search meetings..." />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-ink-secondary text-lg">
                <th className="p-4 sm:p-6 font-medium">Meeting Title</th>
                <th className="p-4 sm:p-6 font-medium">Date</th>
                <th className="p-4 sm:p-6 font-medium">Time</th>
                <th className="p-4 sm:p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMeetings.length > 0 ?
              filteredMeetings.map((m) =>
              <tr
                key={m.id}
                className="hover:bg-slate-50 transition-colors">
                
                    <td className="p-4 sm:p-6 text-xl font-bold text-ink-primary">
                      {m.title}
                    </td>
                    <td className="p-4 sm:p-6 text-lg text-ink-secondary">
                      {m.date}
                    </td>
                    <td className="p-4 sm:p-6 text-lg text-ink-secondary">
                      {m.time}
                    </td>
                    <td className="p-4 sm:p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {activeTab === 'upcoming' &&
                    <Button
                      variant="success"
                      size="md"
                      className="py-2 px-4 text-base"
                      icon={<PlayIcon size={18} />}>
                      
                            Start
                          </Button>
                    }
                        <Button
                      variant="outline"
                      size="md"
                      className="py-2 px-3"
                      aria-label="Copy Link">
                      
                          <CopyIcon size={18} />
                        </Button>
                        <Button
                      variant="outline"
                      size="md"
                      className="py-2 px-3"
                      aria-label="Edit">
                      
                          <EditIcon size={18} />
                        </Button>
                        <Button
                      variant="ghost"
                      size="md"
                      className="py-2 px-3 text-danger hover:bg-red-50"
                      aria-label="Delete">
                      
                          <TrashIcon size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
              ) :

              <tr>
                  <td
                  colSpan={4}
                  className="p-12 text-center text-xl text-ink-secondary">
                  
                    No {activeTab} meetings found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}