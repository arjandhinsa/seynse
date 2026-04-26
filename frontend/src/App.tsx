import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from './api/hooks/useAuth'
import { getAccessToken } from './api/client'
import LoginScreen from './screens/auth/LoginScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import ChallengeBrowseScreen from './screens/ChallengeBrowseScreen'
import ChallengeDetailScreen from './screens/ChallengeDetailScreen'
import ChallengeCompleteScreen from './screens/ChallengeCompleteScreen'
import CelebrationScreen from './screens/CelebrationScreen'
import SenseiChatScreen from './screens/SenseiChatScreen'
import ProfileScreen from './screens/ProfileScreen'
import SettingsScreen from './screens/SettingsScreen'

const ONBOARDED_KEY = 'seynsei.onboarded'

function isAuthed(): boolean {
  return getAccessToken() !== null
}

function isOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === 'true'
}

function QuietLoading() {
  return (
    <div
      className="paper-deep"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-2)',
        fontFamily: 'var(--display)',
        fontStyle: 'italic',
        fontSize: 32,
      }}
    >
      <span className="breathe">…</span>
    </div>
  )
}

function RequireAuth() {
  const me = useCurrentUser()
  if (!isAuthed()) return <Navigate to="/auth/login" replace />
  if (me.isLoading) return <QuietLoading />
  if (me.isError) return <Navigate to="/auth/login" replace />
  return <Outlet />
}

function RequireOnboarded() {
  if (!isOnboarded()) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

function RedirectIfAuthed() {
  if (isAuthed()) return <Navigate to="/home" replace />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthed />}>
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/register" element={<RegisterScreen />} />
        <Route path="/auth/forgot" element={<ForgotPasswordScreen />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<OnboardingScreen />} />

        <Route element={<RequireOnboarded />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/challenges" element={<ChallengeBrowseScreen />} />
          <Route path="/challenges/:id" element={<ChallengeDetailScreen />} />
          <Route path="/challenges/:id/complete" element={<ChallengeCompleteScreen />} />
          <Route path="/celebration" element={<CelebrationScreen />} />
          <Route path="/sensei" element={<SenseiChatScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
