import { Link } from 'react-router-dom'
import { AuthLayout } from '../../components/AuthLayout'

export default function ForgotPasswordScreen() {
  return (
    <AuthLayout>
      <div
        className="fade-up"
        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
      >
        <h2
          className="display-italic"
          style={{ fontSize: 28, margin: 0, lineHeight: 1.2 }}
        >
          Coming soon.
        </h2>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: 14,
            color: 'var(--ink-2)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Password recovery isn't here yet. If you're stuck, reach out and
          we'll sort it manually.
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 40, textAlign: 'center' }}>
        <Link
          to="/auth/login"
          className="display-italic"
          style={{
            color: 'var(--ink-2)',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          <span style={{ color: 'var(--gold-2)' }}>Back to sign in.</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
