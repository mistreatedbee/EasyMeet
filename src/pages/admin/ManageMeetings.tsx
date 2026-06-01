import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, CopyIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { insforge } from '../../lib/insforge';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface Meeting {
  id: string;
  title: string;
  subject: string | null;
  meeting_code: string;
  status: 'waiting' | 'active' | 'ended';
  created_at: string;
}

export function ManageMeetings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'waiting' | 'ended'>('active');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await insforge.database
        .from('meetings')
        .select('id, title, subject, meeting_code, status, created_at')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });
      setMeetings((data as Meeting[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const filtered = meetings.filter(
    (m) => m.status === activeTab && m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (m: Meeting) => {
    if (!window.confirm(`Delete "${m.title}"? This cannot be undone.`)) return;
    await insforge.database.from('meetings').delete().eq('id', m.id);
    setMeetings((prev) => prev.filter((x) => x.id !== m.id));
  };

  const handleCopyLink = (m: Meeting) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${m.meeting_code}`);
    setCopied(m.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">Manage Meetings</h1>
        <p className="text-xl text-ink-secondary">View and manage all your meetings.</p>
      </div>

      <Card padding="none">
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto bg-muted p-1 rounded-xl">
            {(['active', 'waiting', 'ended'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-lg font-bold capitalize transition-colors',
                  activeTab === tab ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary hover:text-ink-primary'
                )}>
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-ink-secondary" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-ink-secondary text-lg">
                <th className="p-4 sm:p-6 font-medium">Meeting Title</th>
                <th className="p-4 sm:p-6 font-medium">Created</th>
                <th className="p-4 sm:p-6 font-medium">Code</th>
                <th className="p-4 sm:p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="p-12 text-center text-xl text-ink-secondary">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-12 text-center text-xl text-ink-secondary">No {activeTab} meetings found.</td></tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 sm:p-6">
                      <div className="text-xl font-bold text-ink-primary">{m.title}</div>
                      {m.subject && <div className="text-sm text-ink-secondary">{m.subject}</div>}
                    </td>
                    <td className="p-4 sm:p-6 text-lg text-ink-secondary">{formatDate(m.created_at)}</td>
                    <td className="p-4 sm:p-6">
                      <span className="font-mono text-base bg-muted px-2 py-1 rounded">{m.meeting_code}</span>
                    </td>
                    <td className="p-4 sm:p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {m.status !== 'ended' && (
                          <Button
                            variant="success"
                            size="md"
                            className="py-2 px-4 text-base"
                            icon={<ExternalLinkIcon size={18} />}
                            onClick={() => navigate(`/admin/control/${m.meeting_code}`)}>
                            Manage
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="md"
                          className="py-2 px-3"
                          aria-label="Copy Link"
                          onClick={() => handleCopyLink(m)}>
                          {copied === m.id ? '✓' : <CopyIcon size={18} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="md"
                          className="py-2 px-3 text-danger hover:bg-red-50"
                          aria-label="Delete"
                          onClick={() => handleDelete(m)}>
                          <TrashIcon size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
