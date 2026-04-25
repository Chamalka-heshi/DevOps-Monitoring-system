import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '20px',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
    justifyContent: 'center',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'var(--accent)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text)',
  },
  tabs: {
    display: 'flex',
    background: 'var(--surface2)',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '28px',
    gap: '4px',
  },
  tab: (active) => ({
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
  }),
  label: {
    display: 'block',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '15px',
    outline: 'none',
    marginBottom: '16px',
    transition: 'border-color 0.2s',
  },
  button: (loading) => ({
    width: '100%',
    padding: '12px',
    background: loading ? 'var(--surface2)' : 'var(--accent)',
    color: loading ? 'var(--text-muted)' : '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '4px',
    transition: 'all 0.2s',
  }),
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '14px',
  },
  success: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#22c55e',
    fontSize: '14px',
    marginTop: '14px',
  },
}

export default function Login() {
  const { login } = useAuth()
  const [tab, setTab] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setError('')
    setSuccess('')
    setUsername('')
    setPassword('')
  }

  const handleTab = (t) => {
    setTab(t)
    reset()
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      if (tab === 'login') {
        const res = await axios.post('/api/auth/login', { username, password })
        login(res.data.token, res.data.username || username)
      } else {
        await axios.post('/api/auth/register', { username, password })
        setSuccess('Account created! You can now log in.')
        setTab('login')
        setPassword('')
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🖥</div>
          <span style={styles.logoText}>DevOps Dashboard</span>
        </div>

        <div style={styles.tabs}>
          <button style={styles.tab(tab === 'login')} onClick={() => handleTab('login')}>
            Login
          </button>
          <button style={styles.tab(tab === 'register')} onClick={() => handleTab('register')}>
            Register
          </button>
        </div>

        <div>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder={tab === 'register' ? 'Min 6 characters' : 'Enter password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />

          <button style={styles.button(loading)} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {error && <div style={styles.error}>⚠ {error}</div>}
          {success && <div style={styles.success}>✓ {success}</div>}
        </div>
      </div>
    </div>
  )
}
