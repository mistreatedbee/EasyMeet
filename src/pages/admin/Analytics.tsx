import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { UsersIcon, ClockIcon, VideoIcon, DownloadIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { insforge } from '../../lib/insforge';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceRow {
  participant_id: string;
  name: string;
  meeting_title: string;
  meeting_code: string;
  joined_at: string;
  left_at: string | null;
  duration_minutes: number;
}

interface DayStats { name: string; participants: number }
interface MeetingStats { name: string; duration: number }

export function Analytics() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [dayStats, setDayStats] = useState<DayStats[]>([]);
  const [meetingStats, setMeetingStats] = useState<MeetingStats[]>([]);
  const [totals, setTotals] = useState({ participants: 0, meetings: 0, avgMinutes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Fetch all meetings for this host
      const { data: meetings } = await insforge.database
        .from('meetings')
        .select('id, title, meeting_code')
        .eq('host_id', user.id);

      if (!meetings || meetings.length === 0) { setLoading(false); return; }

      const meetingIds = meetings.map((m: { id: string }) => m.id);

      // Fetch all participants for those meetings
      const { data: parts } = await insforge.database
        .from('participants')
        .select('id, meeting_id, name, joined_at, left_at')
        .in('meeting_id', meetingIds)
        .neq('role', 'host');

      if (!parts) { setLoading(false); return; }

      const meetingMap: Record<string, { title: string; meeting_code: string }> = {};
      for (const m of meetings) meetingMap[m.id] = { title: m.title, meeting_code: m.meeting_code };

      const rows: AttendanceRow[] = (parts as {
        id: string; meeting_id: string; name: string; joined_at: string; left_at: string | null;
      }[]).map((p) => {
        const duration = p.left_at
          ? Math.round((new Date(p.left_at).getTime() - new Date(p.joined_at).getTime()) / 60000)
          : 0;
        return {
          participant_id: p.id,
          name: p.name,
          meeting_title: meetingMap[p.meeting_id]?.title ?? '',
          meeting_code: meetingMap[p.meeting_id]?.meeting_code ?? '',
          joined_at: p.joined_at,
          left_at: p.left_at,
          duration_minutes: duration,
        };
      });

      setAttendance(rows);

      // Build day-of-week participation chart
      const dayMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (const r of rows) { const d = days[new Date(r.joined_at).getDay()]; dayMap[d]++; }
      setDayStats(days.map((d) => ({ name: d, participants: dayMap[d] })));

      // Build per-meeting duration chart (top 6)
      const mDur: Record<string, { name: string; total: number; count: number }> = {};
      for (const r of rows) {
        if (!mDur[r.meeting_code]) mDur[r.meeting_code] = { name: r.meeting_title, total: 0, count: 0 };
        mDur[r.meeting_code].total += r.duration_minutes;
        mDur[r.meeting_code].count++;
      }
      const mStats = Object.values(mDur)
        .map((v) => ({ name: v.name.length > 14 ? v.name.slice(0, 14) + '…' : v.name, duration: v.count > 0 ? Math.round(v.total / v.count) : 0 }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 6);
      setMeetingStats(mStats);

      // Totals
      const avgMin = rows.length > 0
        ? Math.round(rows.filter((r) => r.duration_minutes > 0).reduce((s, r) => s + r.duration_minutes, 0) / Math.max(rows.filter((r) => r.duration_minutes > 0).length, 1))
        : 0;
      setTotals({ participants: rows.length, meetings: meetings.length, avgMinutes: avgMin });
      setLoading(false);
    })();
  }, [user]);

  const exportCSV = () => {
    const header = 'Name,Meeting,Code,Joined At,Left At,Duration (min)\n';
    const rows = attendance.map((r) =>
      `"${r.name}","${r.meeting_title}","${r.meeting_code}","${r.joined_at}","${r.left_at ?? ''}","${r.duration_minutes}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: 'Total participants', value: totals.participants, icon: <UsersIcon size={28} className="text-primary" /> },
    { label: 'Total meetings', value: totals.meetings, icon: <VideoIcon size={28} className="text-green-500" /> },
    { label: 'Avg. attendance (min)', value: totals.avgMinutes, icon: <ClockIcon size={28} className="text-amber-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">Attendance & Analytics</h1>
          <p className="text-xl text-ink-secondary">Track participation across all your meetings.</p>
        </div>
        <Button
          variant="outline"
          size="lg"
          icon={<DownloadIcon size={20} />}
          onClick={exportCSV}
          disabled={attendance.length === 0}>
          Export CSV
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((s, i) => (
          <Card key={i} padding="sm" className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              {s.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-ink-primary">{loading ? '—' : s.value}</div>
              <div className="text-base text-ink-secondary">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-ink-primary mb-6">Participants by Day of Week</h2>
          {loading ? <div className="h-48 flex items-center justify-center text-ink-secondary">Loading...</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dayStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                <Area type="monotone" dataKey="participants" stroke="#1E5AFF" fill="#1E5AFF20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-ink-primary mb-6">Avg. Attendance Duration by Meeting (min)</h2>
          {loading ? <div className="h-48 flex items-center justify-center text-ink-secondary">Loading...</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={meetingStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                <Bar dataKey="duration" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Attendance Table */}
      <Card padding="none">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-ink-primary">Detailed Attendance Log</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-ink-secondary">Loading attendance data...</div>
        ) : attendance.length === 0 ? (
          <div className="p-8 text-center text-ink-secondary">
            No attendance data yet. Attendance is recorded automatically when participants join and leave meetings.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted text-ink-secondary">
                  <th className="p-4 font-medium">Participant</th>
                  <th className="p-4 font-medium">Meeting</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Left</th>
                  <th className="p-4 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendance.slice(0, 50).map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-ink-primary">{r.name}</td>
                    <td className="p-4 text-ink-secondary">{r.meeting_title}</td>
                    <td className="p-4 text-ink-secondary text-sm">
                      {new Date(r.joined_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 text-ink-secondary text-sm">
                      {r.left_at ? new Date(r.left_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="p-4 text-ink-secondary">
                      {r.duration_minutes > 0 ? `${r.duration_minutes} min` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
