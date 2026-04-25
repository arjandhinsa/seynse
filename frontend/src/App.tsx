import { Routes, Route, Navigate } from 'react-router-dom'

// Placeholder screens — we'll port real ones in Phase 5.1+
function Placeholder({ name }: { name: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      color: 'var(--ink)',
      fontFamily: 'var(--display)',
      fontSize: 32,
    }}>
      {name}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Home" />} />
      <Route path="/challenges" element={<Placeholder name="Challenges" />} />
      <Route path="/sensei" element={<Placeholder name="Sensei" />} />
      <Route path="/profile" element={<Placeholder name="Profile" />} />
      <Route path="/auth/login" element={<Placeholder name="Login" />} />
      <Route path="/auth/register" element={<Placeholder name="Register" />} />
      <Route path="/onboarding" element={<Placeholder name="Onboarding" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App