import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area } from
'recharts';
import { UsersIcon, ClockIcon, VideoIcon, ActivityIcon } from 'lucide-react';
import { Card } from '../../components/Card';
export function Analytics() {
  const attendanceData = [
  {
    name: 'Mon',
    participants: 45
  },
  {
    name: 'Tue',
    participants: 52
  },
  {
    name: 'Wed',
    participants: 38
  },
  {
    name: 'Thu',
    participants: 65
  },
  {
    name: 'Fri',
    participants: 48
  },
  {
    name: 'Sat',
    participants: 12
  },
  {
    name: 'Sun',
    participants: 120
  }];

  const durationData = [
  {
    name: '< 15m',
    count: 12
  },
  {
    name: '15-30m',
    count: 25
  },
  {
    name: '30-60m',
    count: 45
  },
  {
    name: '1-2h',
    count: 18
  },
  {
    name: '> 2h',
    count: 5
  }];

  const stats = [
  {
    label: 'Total Participants',
    value: '380',
    change: '+12%',
    icon: <UsersIcon size={24} className="text-blue-500" />
  },
  {
    label: 'Avg. Meeting Length',
    value: '42m',
    change: '+5%',
    icon: <ClockIcon size={24} className="text-amber-500" />
  },
  {
    label: 'Total Meetings',
    value: '105',
    change: '-2%',
    icon: <VideoIcon size={24} className="text-green-500" />
  },
  {
    label: 'Engagement Score',
    value: '85%',
    change: '+8%',
    icon: <ActivityIcon size={24} className="text-purple-500" />
  }];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-2">
            Analytics
          </h1>
          <p className="text-xl text-ink-secondary">
            Understand how your meetings are being used.
          </p>
        </div>
        <select className="h-12 px-4 text-lg rounded-xl border-2 border-border bg-white text-ink-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) =>
        <Card key={i} padding="sm" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-ink-secondary">
                {stat.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-ink-primary">
                  {stat.value}
                </span>
                <span
                className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Chart */}
        <Card>
          <h3 className="text-xl font-bold text-ink-primary mb-6">
            Attendance over time
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attendanceData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0
                }}>
                
                <defs>
                  <linearGradient
                    id="colorParticipants"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    
                    <stop offset="5%" stopColor="#1E5AFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E5AFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0" />
                
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#475569',
                    fontSize: 14
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#475569',
                    fontSize: 14
                  }} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{
                    color: '#0F172A',
                    fontWeight: 'bold'
                  }} />
                
                <Area
                  type="monotone"
                  dataKey="participants"
                  stroke="#1E5AFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorParticipants)" />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Duration Chart */}
        <Card>
          <h3 className="text-xl font-bold text-ink-primary mb-6">
            Meeting duration distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={durationData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0" />
                
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#475569',
                    fontSize: 14
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#475569',
                    fontSize: 14
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#F1F5F9'
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} />
                
                <Bar dataKey="count" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>);

}