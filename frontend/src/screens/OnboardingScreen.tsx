import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../api/hooks/useAuth'
import { AuthLayout } from '../components/AuthLayout'
import { SoftButton } from '../components/SoftButton'
import { SoftInput } from '../components/SoftInput'

const ONBOARDED_KEY = 'seynsei.onboarded'
const DISPLAY_NAME_KEY = 'seynsei.display_name'

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const me = useCurrentUser()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')

  useEffect(() => {
    if (me.data?.display_name) setName(me.data.display_name)
  }, [me.data?.display_name])

  const finish = () => {
    localStorage.setItem(ONBOARDED_KEY, 'true')
    navigate('/home', { replace: true })
  }

  const handleNameContinue = () => {
    const trimmed = name.trim()
    const initial = me.data?.display_name ?? ''
    if (trimmed && trimmed !== initial) {
      // TODO: persist display_name to backend once a PATCH endpoint for it
      // exists. For now we keep it client-side so the rest of the UI can
      // address the user by name.
      localStorage.setItem(DISPLAY_NAME_KEY, trimmed)
    }
    setStep(3)
  }

  return (
    <AuthLayout showWordmark={false}>
      {step === 1 && (
        <div
          key="step-1"
          className="fade-up"
          style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          <h1
            className="display"
            style={{
              fontSize: 38,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            Welcome to{' '}
            <span className="display-italic">Seynsei</span>.
          </h1>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: 15,
              color: 'var(--ink-2)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            A quiet space to practise being seen. Your coach is Sensei. We
            move at your pace — there's no rush.
          </p>
          <SoftButton
            primary
            onClick={() => setStep(2)}
            style={{ marginTop: 16 }}
          >
            Begin
          </SoftButton>
        </div>
      )}

      {step === 2 && (
        <div
          key="step-2"
          className="fade-up"
          style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          <h2
            className="display-italic"
            style={{ fontSize: 30, margin: 0, lineHeight: 1.2 }}
          >
            What should Sensei call you?
          </h2>
          <SoftInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 8,
            }}
          >
            <SoftButton primary onClick={handleNameContinue}>
              Continue
            </SoftButton>
            <SoftButton onClick={() => setStep(3)}>Skip</SoftButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div
          key="step-3"
          className="fade-up"
          style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          <h2
            className="display-italic"
            style={{ fontSize: 34, margin: 0, lineHeight: 1.15 }}
          >
            You're set. Take a breath.
          </h2>
          <SoftButton primary onClick={finish} style={{ marginTop: 16 }}>
            Enter
          </SoftButton>
        </div>
      )}
    </AuthLayout>
  )
}
