import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useScreenInit } from './useScreenInit';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { JoinMeeting } from './pages/JoinMeeting';
import { WaitingRoom } from './pages/WaitingRoom';
import { MeetingRoom } from './pages/MeetingRoom';
import { HelpCenter } from './pages/HelpCenter';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateMeeting } from './pages/admin/CreateMeeting';
import { ScheduleMeeting } from './pages/admin/ScheduleMeeting';
import { ManageMeetings } from './pages/admin/ManageMeetings';
import { Recordings } from './pages/admin/Recordings';
import { Analytics } from './pages/admin/Analytics';
import { ControlPanel } from './pages/admin/ControlPanel';
import { AuthProvider } from './contexts/AuthContext';
import { MeetingProvider } from './contexts/MeetingContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function MeetingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  useScreenInit();
  return (
    <AuthProvider>
      <MeetingProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Marketing Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/help" element={<HelpCenter />} />
            </Route>

            {/* Meeting Flow Routes — dynamic meetingCode param */}
            <Route element={<MeetingLayout />}>
              <Route path="/join/:meetingCode" element={<JoinMeeting />} />
              {/* /join without a code → back to home */}
              <Route path="/join" element={<Navigate to="/" replace />} />
              <Route path="/waiting/:meetingCode" element={<WaitingRoom />} />
              <Route path="/meeting/:meetingCode" element={<MeetingRoom />} />
            </Route>

            {/* Admin Login (public) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes (protected) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="create" element={<CreateMeeting />} />
                <Route path="schedule" element={<ScheduleMeeting />} />
                <Route path="meetings" element={<ManageMeetings />} />
                <Route path="recordings" element={<Recordings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="control/:meetingCode" element={<ControlPanel />} />
                <Route path="control" element={<ControlPanel />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </MeetingProvider>
    </AuthProvider>
  );
}
