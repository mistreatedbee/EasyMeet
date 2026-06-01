import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
export function ScheduleMeeting() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
          Schedule a Meeting
        </h1>
        <p className="text-xl text-ink-secondary">
          Plan ahead and send invitations to your guests.
        </p>
      </div>

      <Card>
        <div className="space-y-8">
          <Input label="Meeting Title" placeholder="e.g. Weekly Team Sync" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-ink-primary">
                Duration
              </label>
              <select className="h-16 px-5 text-xl rounded-xl border-2 border-border bg-white text-ink-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>1.5 hours</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-ink-primary">
                Recurrence
              </label>
              <select className="h-16 px-5 text-xl rounded-xl border-2 border-border bg-white text-ink-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all">
                <option>Does not repeat</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-ink-primary">
              Invite Participants (Optional)
            </label>
            <textarea
              className="min-h-[120px] p-5 text-xl rounded-xl border-2 border-border bg-white text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all resize-y"
              placeholder="Enter email addresses separated by commas" />
            
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<CalendarIcon size={24} />}>
              
              Schedule Meeting
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}