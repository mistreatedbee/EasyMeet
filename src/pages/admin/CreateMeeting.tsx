import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoIcon, CopyIcon, CheckIcon, ExternalLinkIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { insforge } from '../../lib/insforge';
import { useAuth } from '../../contexts/AuthContext';
import { nanoid } from 'nanoid';

export function CreateMeeting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [autoRecord, setAutoRecord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ meetingCode: string; meetingLink: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');

    const meetingCode = nanoid(10);
    const meetingLink = `${window.location.origin}/join/${meetingCode}`;

    const { data, error: dbError } = await insforge.database
      .from('meetings')
      .insert([{
        meeting_code: meetingCode,
        title: title.trim(),
        subject: subject.trim() || null,
        description: description.trim() || null,
        host_id: user!.id,
        status: 'waiting',
        waiting_room_enabled: waitingRoom,
        chat_enabled: chatEnabled,
        livekit_room_name: meetingCode,
        settings: { auto_record: autoRecord },
      }])
      .select()
      .single();

    setLoading(false);

    if (dbError || !data) {
      setError('Failed to create meeting. Please try again.');
      return;
    }

    setCreated({ meetingCode, meetingLink });
  };

  const handleCopy = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartNow = () => {
    if (!created) return;
    navigate(`/admin/control/${created.meetingCode}`);
  };

  if (created) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">Meeting Created!</h1>
          <p className="text-xl text-ink-secondary">Share the link below with your participants.</p>
        </div>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckIcon size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-primary mb-1">{title}</h2>
              <p className="text-ink-secondary">Meeting ID: <span className="font-mono font-bold text-ink-primary">{created.meetingCode}</span></p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-ink-primary mb-4">Meeting Link</h3>
          <a
            href={created.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-muted hover:bg-primary/5 border border-border hover:border-primary rounded-xl p-4 mb-4 transition-colors group"
          >
            <span className="flex-1 break-all font-mono text-base text-primary">
              {created.meetingLink}
            </span>
            <ExternalLinkIcon size={18} className="text-ink-secondary group-hover:text-primary flex-shrink-0" />
          </a>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button
              variant="success"
              size="lg"
              icon={<VideoIcon size={20} />}
              onClick={handleStartNow}
              className="flex-1"
            >
              Start Meeting Now
            </Button>
          </div>
          <p className="text-center text-ink-secondary mt-4 text-base">
            Students don't need an account — just click the link and enter their name.
          </p>
        </Card>

        <Button
          variant="outline"
          size="md"
          onClick={() => { setCreated(null); setTitle(''); setSubject(''); setDescription(''); }}
        >
          Create Another Meeting
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">Create a Meeting</h1>
        <p className="text-xl text-ink-secondary">Set up an instant meeting and share the link.</p>
      </div>

      <Card>
        <form onSubmit={handleCreate} className="space-y-6">
          <Input
            label="Meeting / Class Name *"
            placeholder="e.g. Mathematics Grade 10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Subject (optional)"
            placeholder="e.g. Algebra, Sunday Service, Weekly Update"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <div>
            <label className="block text-base font-semibold text-ink-primary mb-2">
              Description (optional)
            </label>
            <textarea
              className="w-full h-24 px-4 py-3 border-2 border-border rounded-xl text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="What is this meeting about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-ink-primary">Meeting Options</h3>

            {[
              { checked: waitingRoom, onChange: setWaitingRoom, label: 'Enable Waiting Room', desc: 'You must admit participants before they can join.' },
              { checked: chatEnabled, onChange: setChatEnabled, label: 'Allow Chat', desc: 'Participants can send text messages during the meeting.' },
              { checked: autoRecord, onChange: setAutoRecord, label: 'Record Automatically', desc: 'Start recording as soon as the meeting begins.' },
            ].map(({ checked, onChange, label, desc }) => (
              <label key={label} className="flex items-center gap-4 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded text-primary focus:ring-primary"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                />
                <div className="flex-1">
                  <div className="text-lg font-bold text-ink-primary">{label}</div>
                  <div className="text-base text-ink-secondary">{desc}</div>
                </div>
              </label>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-base">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <Button
              type="submit"
              variant="success"
              size="xl"
              fullWidth
              icon={<VideoIcon size={24} />}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Creating...' : 'Create Meeting'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
