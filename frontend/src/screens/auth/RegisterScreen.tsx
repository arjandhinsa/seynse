import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../../api/hooks/useAuth'
import { ApiError } from '../../api/client'
import { AuthLayout, SoftError } from '../../components/AuthLayout'
import { SoftButton } from '../../components/SoftButton'
import { SoftInput } from '../../components/SoftInput'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const register = useRegister()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register.mutate(
      { email: email.trim(), password },
      { onSuccess: () => navigate('/onboarding', { replace: true }) },
    )
  }

  const errorMessage = register.isError
    ? register.error instanceof ApiError
      ? register.error.detail
      : 'Something went wrong. Please try again in a moment.'
    : null

  return (
    <AuthLayout>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
      >
        <SoftInput
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SoftInput
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <SoftError message={errorMessage} />}
        <SoftButton
          primary
          type="submit"
          disabled={register.isPending}
          style={{ marginTop: 8 }}
        >
          {register.isPending ? 'A moment…' : 'Begin'}
        </SoftButton>
      </form>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 40,
          textAlign: 'center',
        }}
      >
        <Link
          to="/auth/login"
          className="display-italic"
          style={{
            color: 'var(--ink-2)',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          Already practising?{' '}
          <span style={{ color: 'var(--gold-2)' }}>Sign in.</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
