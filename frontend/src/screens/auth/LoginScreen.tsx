import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../../api/hooks/useAuth'
import { ApiError } from '../../api/client'
import { AuthLayout, SoftError } from '../../components/AuthLayout'
import { SoftButton } from '../../components/SoftButton'
import { SoftInput } from '../../components/SoftInput'

export default function LoginScreen() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => navigate('/home', { replace: true }) },
    )
  }

  const errorMessage = login.isError
    ? login.error instanceof ApiError
      ? login.error.detail
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
          autoComplete="current-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <SoftError message={errorMessage} />}
        <SoftButton
          primary
          type="submit"
          disabled={login.isPending}
          style={{ marginTop: 8 }}
        >
          {login.isPending ? 'A moment…' : 'Sign in'}
        </SoftButton>
      </form>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 40,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Link
          to="/auth/forgot"
          style={{
            color: 'var(--ink-3)',
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          Forgot password?
        </Link>
        <Link
          to="/auth/register"
          className="display-italic"
          style={{
            color: 'var(--ink-2)',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          New here?{' '}
          <span style={{ color: 'var(--gold-2)' }}>Begin.</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
