import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { FloatingHelpButton } from '../components/FloatingHelpButton';
export function WaitingRoom() {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  // Auto-navigate to meeting room after a few seconds to simulate being admitted
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/meeting');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 py-12 bg-background">
      <div className="w-full max-w-2xl text-center">
        {/* Custom SVG Illustration */}
        <div className="mb-12 flex justify-center">
          <motion.svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut'
            }}>
            
            <circle cx="100" cy="100" r="80" fill="#E0E7FF" />
            <path
              d="M100 60V100L125 125"
              stroke="#1E5AFF"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round" />
            
            <circle cx="100" cy="100" r="12" fill="#1E5AFF" />
          </motion.svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-ink-primary mb-6">
          Waiting for the host to let you in...
        </h1>
        <p className="text-2xl text-ink-secondary mb-12">
          This usually takes less than a minute. Sit tight!
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center gap-3 mb-16">
          {[0, 1, 2].map((i) =>
          <motion.div
            key={i}
            className="w-5 h-5 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.2
            }} />

          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          {/* Connection Status */}
          <Card
            padding="sm"
            className="flex items-center justify-center gap-4 bg-white">
            
            <div className="w-6 h-6 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xl font-medium">Internet: Excellent</span>
          </Card>

          {/* Device Test */}
          <Card
            padding="sm"
            className="flex items-center justify-center gap-6 bg-white">
            
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-4 rounded-full transition-colors focus-visible:ring-4 focus-visible:ring-primary ${micOn ? 'bg-slate-100 text-ink-primary hover:bg-slate-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}>
              
              {micOn ? <MicIcon size={28} /> : <MicOffIcon size={28} />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-4 rounded-full transition-colors focus-visible:ring-4 focus-visible:ring-primary ${cameraOn ? 'bg-slate-100 text-ink-primary hover:bg-slate-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
              aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}>
              
              {cameraOn ? <VideoIcon size={28} /> : <VideoOffIcon size={28} />}
            </button>
          </Card>
        </div>
      </div>
      <FloatingHelpButton />
    </div>);

}