import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  VideoIcon,
  ClockIcon,
  CalendarIcon,
  PlusCircleIcon,
  PlayIcon } from
'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
export function AdminDashboard() {
  const stats = [
  {
    label: 'Active meetings now',
    value: '2',
    icon: <VideoIcon size={32} className="text-green-500" />
  },
  {
    label: 'Total meetings this week',
    value: '14',
    icon: <CalendarIcon size={32} className="text-primary" />
  },
  {
    label: 'Total participants',
    value: '128',
    icon: <UsersIcon size={32} className="text-blue-500" />
  },
  {
    label: 'Hours hosted',
    value: '32.5',
    icon: <ClockIcon size={32} className="text-amber-500" />
  }];

  const recentMeetings = [
  {
    id: 1,
    title: 'Sunday Service',
    date: 'Today, 10:00 AM',
    participants: 45,
    status: 'Active'
  },
  {
    id: 2,
    title: 'Board Meeting Q4',
    date: 'Yesterday, 2:00 PM',
    participants: 8,
    status: 'Ended'
  },
  {
    id: 3,
    title: 'Math Class - Grade 5',
    date: 'Oct 12, 9:00 AM',
    participants: 22,
    status: 'Ended'
  }];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
            Good morning, Sarah
          </h1>
          <p className="text-xl text-ink-secondary">
            Here's what's happening with your meetings today.
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Link to="/admin/create" className="flex-1 sm:flex-none">
            <Button
              variant="success"
              icon={<PlusCircleIcon size={24} />}
              fullWidth>
              
              Start Now
            </Button>
          </Link>
          <Link to="/admin/schedule" className="flex-1 sm:flex-none">
            <Button
              variant="primary"
              icon={<CalendarIcon size={24} />}
              fullWidth>
              
              Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) =>
        <Card key={i} padding="sm" className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-ink-primary">
                {stat.value}
              </div>
              <div className="text-lg text-ink-secondary font-medium">
                {stat.label}
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings Table */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ink-primary">
              Recent Meetings
            </h2>
            <Link
              to="/admin/meetings"
              className="text-lg font-medium text-primary hover:text-primary-dark">
              
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted text-ink-secondary text-lg">
                  <th className="p-4 font-medium">Meeting Title</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Participants</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentMeetings.map((m) =>
                <tr
                  key={m.id}
                  className="hover:bg-slate-50 transition-colors">
                  
                    <td className="p-4 text-lg font-bold text-ink-primary">
                      {m.title}
                    </td>
                    <td className="p-4 text-lg text-ink-secondary">{m.date}</td>
                    <td className="p-4 text-lg text-ink-secondary">
                      {m.participants}
                    </td>
                    <td className="p-4">
                      <span
                      className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {m.status === 'Active' ?
                    <Link to="/admin/control">
                          <Button
                        variant="outline"
                        size="md"
                        className="py-2 px-4 text-base">
                        
                            Join
                          </Button>
                        </Link> :

                    <Link to="/admin/recordings">
                          <Button
                        variant="ghost"
                        size="md"
                        className="py-2 px-4 text-base text-primary"
                        icon={<PlayIcon size={18} />}>
                        
                            Recording
                          </Button>
                        </Link>
                    }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Meetings List */}
        <Card padding="none" className="flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-ink-primary">Upcoming</h2>
          </div>
          <div className="p-6 space-y-6 flex-grow">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold uppercase">Oct</span>
                <span className="text-xl font-bold">15</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink-primary">
                  Weekly Staff Sync
                </h3>
                <p className="text-lg text-ink-secondary mb-2">
                  9:00 AM - 10:00 AM
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    className="py-1 px-3 text-sm h-auto">
                    
                    Copy Link
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    className="py-1 px-3 text-sm h-auto text-primary">
                    
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold uppercase">Oct</span>
                <span className="text-xl font-bold">16</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink-primary">
                  Parent Teacher Conf
                </h3>
                <p className="text-lg text-ink-secondary mb-2">
                  3:00 PM - 5:00 PM
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    className="py-1 px-3 text-sm h-auto">
                    
                    Copy Link
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    className="py-1 px-3 text-sm h-auto text-primary">
                    
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border bg-slate-50 text-center">
            <Link
              to="/admin/schedule"
              className="text-lg font-medium text-primary hover:text-primary-dark">
              
              Schedule a new meeting
            </Link>
          </div>
        </Card>
      </div>
    </div>);

}