import React, { useState } from 'react';
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  UserXIcon,
  ShieldIcon,
  LockIcon,
  UnlockIcon,
  MessageSquareOffIcon,
  PhoneOffIcon,
  MonitorUpIcon } from
'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { cn } from '../../utils/cn';
export function ControlPanel() {
  const [isLocked, setIsLocked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [participants, setParticipants] = useState([
  {
    id: 1,
    name: 'Mary Smith',
    role: 'Guest',
    micOn: true,
    cameraOn: true
  },
  {
    id: 2,
    name: 'David M.',
    role: 'Guest',
    micOn: false,
    cameraOn: true
  },
  {
    id: 3,
    name: 'Robert Johnson',
    role: 'Guest',
    micOn: false,
    cameraOn: false
  },
  {
    id: 4,
    name: 'Susan Davis',
    role: 'Guest',
    micOn: true,
    cameraOn: false
  },
  {
    id: 5,
    name: 'Michael Brown',
    role: 'Presenter',
    micOn: true,
    cameraOn: true
  }]
  );
  const toggleMic = (id: number) => {
    setParticipants((p) =>
    p.map((user) =>
    user.id === id ?
    {
      ...user,
      micOn: !user.micOn
    } :
    user
    )
    );
  };
  const toggleCamera = (id: number) => {
    setParticipants((p) =>
    p.map((user) =>
    user.id === id ?
    {
      ...user,
      cameraOn: !user.cameraOn
    } :
    user
    )
    );
  };
  const removeUser = (id: number) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      setParticipants((p) => p.filter((user) => user.id !== id));
    }
  };
  const muteAll = () => {
    setParticipants((p) =>
    p.map((user) => ({
      ...user,
      micOn: false
    }))
    );
  };
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink-primary mb-1">
            Host Controls: Sunday Service
          </h1>
          <p className="text-lg text-ink-secondary">
            Manage participants and meeting settings.
          </p>
        </div>
        <Button variant="danger" size="md" icon={<PhoneOffIcon size={20} />}>
          End Meeting for All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Global Controls & Preview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mini Preview */}
          <Card
            padding="none"
            className="bg-slate-900 overflow-hidden border-slate-800">
            
            <div className="aspect-video relative flex items-center justify-center">
              <div className="text-slate-500 text-lg font-medium">
                Live Meeting Preview
              </div>
              {isRecording &&
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-white text-sm font-bold">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC
                </div>
              }
            </div>
          </Card>

          {/* Global Actions */}
          <Card>
            <h2 className="text-xl font-bold text-ink-primary mb-4">
              Global Actions
            </h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={muteAll}
                className="justify-start">
                
                <MicOffIcon size={20} className="mr-3 text-ink-secondary" />
                Mute All Participants
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <VideoOffIcon size={20} className="mr-3 text-ink-secondary" />
                Disable All Cameras
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsLocked(!isLocked)}
                className={cn(
                  'justify-start',
                  isLocked && 'bg-amber-50 border-amber-200 text-amber-800'
                )}>
                
                {isLocked ?
                <LockIcon size={20} className="mr-3" /> :

                <UnlockIcon size={20} className="mr-3 text-ink-secondary" />
                }
                {isLocked ? 'Meeting Locked' : 'Lock Meeting'}
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setChatEnabled(!chatEnabled)}
                className={cn(
                  'justify-start',
                  !chatEnabled && 'bg-amber-50 border-amber-200 text-amber-800'
                )}>
                
                <MessageSquareOffIcon
                  size={20}
                  className={cn(
                    'mr-3',
                    !chatEnabled ? '' : 'text-ink-secondary'
                  )} />
                
                {chatEnabled ? 'Disable Chat' : 'Chat Disabled'}
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  'justify-start',
                  isRecording && 'bg-red-50 border-red-200 text-red-700'
                )}>
                
                <div
                  size={20}
                  className={cn(
                    'mr-3',
                    isRecording ? 'animate-pulse' : 'text-ink-secondary'
                  )} />
                
                {isRecording ? 'Recording...' : 'Start Recording'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Participant List */}
        <Card className="lg:col-span-2 flex flex-col h-[600px]" padding="none">
          <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold text-ink-primary">
              Participants ({participants.length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                className="py-1.5 px-3 text-sm h-auto">
                
                Admit All
              </Button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-2">
            {participants.map((p) =>
            <div
              key={p.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-border last:border-0">
              
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-ink-primary flex items-center gap-2">
                      {p.name}
                      {p.role === 'Presenter' &&
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                          Presenter
                        </span>
                    }
                    </div>
                    <div className="text-sm text-ink-secondary">{p.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                  onClick={() => toggleMic(p.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    p.micOn ?
                    'text-ink-secondary hover:bg-slate-200' :
                    'bg-red-100 text-red-600'
                  )}
                  title={p.micOn ? 'Mute' : 'Unmute'}>
                  
                    {p.micOn ? <MicIcon size={20} /> : <MicOffIcon size={20} />}
                  </button>
                  <button
                  onClick={() => toggleCamera(p.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    p.cameraOn ?
                    'text-ink-secondary hover:bg-slate-200' :
                    'bg-red-100 text-red-600'
                  )}
                  title={p.cameraOn ? 'Disable Camera' : 'Enable Camera'}>
                  
                    {p.cameraOn ?
                  <VideoIcon size={20} /> :

                  <VideoOffIcon size={20} />
                  }
                  </button>

                  <div className="w-px h-8 bg-border mx-1 hidden sm:block" />

                  <button
                  className="p-2 text-ink-secondary hover:bg-slate-200 rounded-lg transition-colors hidden sm:block"
                  title="Promote to Presenter">
                  
                    <MonitorUpIcon size={20} />
                  </button>
                  <button
                  onClick={() => removeUser(p.id)}
                  className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove User">
                  
                    <UserXIcon size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}