import React, { useState } from 'react';
import { VideoIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
export function CreateMeeting() {
  const [copied, setCopied] = useState(false);
  const meetingCode = '482-193-227';
  const meetingLink = `https://easymeet.example.com/join/${meetingCode}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
          Create an Instant Meeting
        </h1>
        <p className="text-xl text-ink-secondary">
          Start a meeting right now and invite others to join.
        </p>
      </div>

      <Card>
        <div className="space-y-8">
          <Input
            label="Meeting Title"
            placeholder="e.g. Quick Catch-up"
            defaultValue="Sarah's Personal Meeting Room" />
          

          <Input
            label="Meeting Password (Optional)"
            placeholder="Leave blank for no password"
            type="password" />
          

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-ink-primary">
              Meeting Options
            </h3>

            <label className="flex items-center gap-4 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
              <input
                type="checkbox"
                className="w-6 h-6 rounded text-primary focus:ring-primary"
                defaultChecked />
              
              <div className="flex-1">
                <div className="text-lg font-bold text-ink-primary">
                  Enable Waiting Room
                </div>
                <div className="text-base text-ink-secondary">
                  You must admit guests before they can join.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
              <input
                type="checkbox"
                className="w-6 h-6 rounded text-primary focus:ring-primary"
                defaultChecked />
              
              <div className="flex-1">
                <div className="text-lg font-bold text-ink-primary">
                  Allow Chat
                </div>
                <div className="text-base text-ink-secondary">
                  Participants can send text messages during the meeting.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
              <input
                type="checkbox"
                className="w-6 h-6 rounded text-primary focus:ring-primary" />
              
              <div className="flex-1">
                <div className="text-lg font-bold text-ink-primary">
                  Record Automatically
                </div>
                <div className="text-base text-ink-secondary">
                  Start recording as soon as the meeting begins.
                </div>
              </div>
            </label>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
            <Button
              variant="success"
              size="xl"
              icon={<VideoIcon size={24} />}
              className="flex-1">
              
              Start Meeting Now
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <h3 className="text-xl font-bold text-ink-primary mb-4">Invite Link</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white border-2 border-primary/20 rounded-xl p-4 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-primary tracking-widest">
              {meetingCode}
            </span>
          </div>
          <Button
            variant="outline"
            size="lg"
            icon={copied ? <CheckIcon size={24} /> : <CopyIcon size={24} />}
            onClick={handleCopy}
            className="bg-white">
            
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
        <p className="text-center text-ink-secondary mt-4">
          Share this code or link with your participants. They don't need an
          account to join.
        </p>
      </Card>
    </div>);

}