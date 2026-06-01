import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UsersIcon, VideoIcon, ClockIcon, CalendarIcon,
  PlusCircleIcon, ExternalLinkIcon,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { insforge } from '../../lib/insforge';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface Meeting {
  id: string;
  title: string;
  meeting_code: string;
  status: 'waiting' | 'active' | 'ended';
  created_at: string;
  participant_count?: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({ active: 0, total: 0, participants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: meetings } = await insforge.database
        .from('meetings')
        .select('id, title, meeting_code, status, created_at')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (meetings) {
        setRecentMeetings(meetings as Meeting[]);
        const active = (meetings as Meeting[]).filter((m) => m.status === 'active').length;
        const total = meetings.length;
        setStats((s) => ({ ...s, active, total }));
      }

      const { data: parts } = await insforge.database
        .from('participants')
        .select('id, meeting_id')
        .in('meeting_id', (meetings ?? []).map((m: Meeting) => m.id));

      if (parts) {
        setStats((s) => ({ ...s, participants: parts.length }));
      }

      setLoading(false);
    })();
  }, [user]);

  const firstName = user?.profile?.name?.split(' ')[0] ?? 'Teacher';

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const statCards = [
    { label: 'Active meetings now', value: String(stats.active), icon: <VideoIcon size={32} className="text-green-500" /> },
    { label: 'Total meetings created', value: String(stats.total), icon: <CalendarIcon size={32} className="text-primary" /> },
    { label: 'Total participants', value: String(stats.participants), icon: <UsersIcon size={32} className="text-blue-500" /> },
    { label: 'This session', value: '—', icon: <ClockIcon size={32} className="text-amber-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
            Good morning, {firstName}
          </h1>
          <p className="text-xl text-ink-secondary">
            Here's what's happening with your meetings.
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Link to="/admin/create" className="flex-1 sm:flex-none">
            <Button variant="success" icon={<PlusCircleIcon size={24} />} fullWidth>
              New Meeting
            </Button>
          </Link>
          <Link to="/admin/schedule" className="flex-1 sm:flex-none">
            <Button variant="primary" icon={<CalendarIcon size={24} />} fullWidth>
              Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} padding="sm" className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-ink-primary">{loading ? '—' : stat.value}</div>
              <div className="text-lg text-ink-secondary font-medium">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings Table */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ink-primary">Recent Meetings</h2>
            <Link to="/admin/meetings" className="text-lg font-medium text-primary hover:text-primary-dark">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-ink-secondary">Loading...</div>
          ) : recentMeetings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-ink-secondary text-lg mb-4">No meetings yet.</p>
              <Link to="/admin/create">
                <Button variant="success" icon={<PlusCircleIcon size={20} />}>Create your first meeting</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted text-ink-secondary text-lg">
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentMeetings.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-lg font-bold text-ink-primary">{m.title}</td>
                      <td className="p-4 text-lg text-ink-secondary">{formatDate(m.created_at)}</td>
                      <td className="p-4">
                        <span className={cn('px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider',
                          m.status === 'active' ? 'bg-green-100 text-green-700' :
                          m.status === 'ended' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-700'
                        )}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="md"
                          className="py-2 px-4 text-base"
                          icon={<ExternalLinkIcon size={16} />}
                          onClick={() => navigate(`/admin/control/${m.meeting_code}`)}>
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card padding="none" className="flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-ink-primary">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4 flex-grow">
            <Link to="/admin/create">
              <Button variant="success" size="lg" fullWidth icon={<VideoIcon size={22} />} className="mb-3">
                Start Instant Meeting
              </Button>
            </Link>
            <Link to="/admin/meetings">
              <Button variant="outline" size="lg" fullWidth icon={<CalendarIcon size={22} />} className="mb-3">
                Manage All Meetings
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" size="lg" fullWidth icon={<UsersIcon size={22} />}>
                View Attendance
              </Button>
            </Link>
          </div>
          <div className="p-4 border-t border-border bg-slate-50 text-center">
            <Link to="/admin/schedule" className="text-lg font-medium text-primary hover:text-primary-dark">
              Schedule a new meeting →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
