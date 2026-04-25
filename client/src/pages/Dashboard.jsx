import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts'
import { useAuth } from '../context/AuthContext'

// ── helpers ───────────────────────────────────────────────
const fmt = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
const fmtUptime = (secs) => {
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

// ── sub-components ────────────────────────────────────────
function StatCard({ label, value, sub, color = '#6366f1', alert }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${alert ? color : 'var(--border)'}`,
      borderRadius: '12px',
      padding: '20px 24px',
      flex: '1 1 180px',
      minWidth: '160px',
      boxShadow: alert ? `0 0 12px ${color}33` : 'none',
      transition: 'all 0.3s',
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: '700', color, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function AlertBanner({ message }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.12)',
      border: '1px solid rgba(239,68,68,0.35)',
      borderRadius: '10px',
      padding: '12px 18px',
      color: '#ef4444',
      fontWeight: 600,
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      ⚠ {message}
    </div>
  )
}

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1a1d27',
    border: '1px solid #2e3348',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
  },
}

// ── main component ────────────────────────────────────────
export default function Dashboard() {
  // ✅ ALL hooks declared at the top — never after an early return
  const { token, username, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Guard inside the effect body — never before the hook
    if (!token) return

    const fetchStats = () => {
      axios
        .get('/api/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data
          setStats(data)
          setError(null)
          setLoading(false)
          setHistory((prev) => [
            ...prev.slice(-19),
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              cpu: data.cpuLoad,
              mem: data.memoryUsagePercent,
            },
          ])
        })
        .catch((err) => {
          setLoading(false)
          if (err.response?.status === 401) {
            setError('Session expired — please log in again')
            logout()
          } else {
            setError('Cannot reach server. Is the backend running?')
          }
        })
    }

    fetchStats()
    const interval = setInterval(fetchStats, 3000)
    return () => clearInterval(interval)
  }, [token, logout])

  // ── render ─────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '0 0 40px',
    },
    header: {
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: {
      width: '32px', height: '32px',
      background: 'var(--accent)',
      borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '16px',
    },
    headerTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text)' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px' },
    userBadge: {
      color: 'var(--text-muted)',
      background: 'var(--surface2)',
      padding: '5px 12px',
      borderRadius: '20px',
      border: '1px solid var(--border)',
    },
    logoutBtn: {
      background: 'transparent',
      border: '1px solid var(--border)',
      color: 'var(--text-muted)',
      padding: '5px 14px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    body: { padding: '28px 32px', maxWidth: '1200px', margin: '0 auto' },
    section: { marginBottom: '28px' },
    sectionTitle: {
      fontSize: '14px', fontWeight: '600',
      color: 'var(--text-muted)', textTransform: 'uppercase',
      letterSpacing: '0.08em', marginBottom: '14px',
    },
    cards: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    chartCard: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px 24px',
    },
    chartTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: 'var(--text)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' },
    infoRow: {
      display: 'flex', flexWrap: 'wrap', gap: '8px',
    },
    infoPill: {
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '6px 14px',
      fontSize: '13px',
      color: 'var(--text-muted)',
    },
    dot: (ok) => ({
      display: 'inline-block', width: '8px', height: '8px',
      borderRadius: '50%', background: ok ? 'var(--green)' : 'var(--red)',
      marginRight: '6px',
    }),
  }

  if (loading) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          ⏳ Connecting to server…
        </div>
      </div>
    )
  }

  const cpuAlert = stats?.cpuLoad > 2
  const memAlert = stats?.memoryUsagePercent > 85

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logoIcon}>🖥</div>
          <span style={s.headerTitle}>DevOps Dashboard</span>
          <span style={{ ...s.dot(!!stats && !error), marginLeft: '8px' }} />
          <span style={{ fontSize: '12px', color: stats && !error ? 'var(--green)' : 'var(--red)' }}>
            {stats && !error ? 'Live' : 'Offline'}
          </span>
        </div>
        <div style={s.headerRight}>
          <span style={s.userBadge}>👤 {username}</span>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={s.body}>
        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: '20px' }}>
            <AlertBanner message={error} />
          </div>
        )}

        {/* Alerts */}
        {(cpuAlert || memAlert) && (
          <div style={{ ...s.section, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cpuAlert && <AlertBanner message={`High CPU load: ${stats.cpuLoad} (threshold: 2.0)`} />}
            {memAlert && <AlertBanner message={`High memory usage: ${stats.memoryUsagePercent}% (threshold: 85%)`} />}
          </div>
        )}

        {stats && (
          <>
            {/* Stat cards */}
            <div style={s.section}>
              <div style={s.sectionTitle}>System Metrics</div>
              <div style={s.cards}>
                <StatCard
                  label="CPU Load (1m avg)"
                  value={stats.cpuLoad}
                  sub={`${stats.cpuCount} cores`}
                  color={cpuAlert ? '#ef4444' : '#6366f1'}
                  alert={cpuAlert}
                />
                <StatCard
                  label="Memory Used"
                  value={`${stats.memoryUsagePercent}%`}
                  sub={`${fmt(stats.usedMemory)} / ${fmt(stats.totalMemory)}`}
                  color={memAlert ? '#ef4444' : '#3b82f6'}
                  alert={memAlert}
                />
                <StatCard
                  label="Free Memory"
                  value={fmt(stats.freeMemory)}
                  color="#22c55e"
                />
                <StatCard
                  label="Uptime"
                  value={fmtUptime(stats.uptime)}
                  color="#f59e0b"
                />
              </div>
            </div>

            {/* Charts */}
            <div style={s.section}>
              <div style={s.sectionTitle}>History (last 20 polls)</div>
              <div style={s.grid}>
                <div style={s.chartCard}>
                  <div style={s.chartTitle}>📈 CPU Load</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fill: '#8892a4', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} />
                      <Tooltip {...CHART_TOOLTIP_STYLE} />
                      <Area type="monotone" dataKey="cpu" stroke="#6366f1" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={s.chartCard}>
                  <div style={s.chartTitle}>💾 Memory Usage %</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#2e3348" strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fill: '#8892a4', fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#8892a4', fontSize: 11 }} unit="%" />
                      <Tooltip {...CHART_TOOLTIP_STYLE} />
                      <Area type="monotone" dataKey="mem" stroke="#3b82f6" fill="url(#memGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* System info */}
            <div style={s.section}>
              <div style={s.sectionTitle}>System Info</div>
              <div style={s.chartCard}>
                <div style={s.infoRow}>
                  <span style={s.infoPill}>🖥 Platform: {stats.platform}</span>
                  <span style={s.infoPill}>🏷 Hostname: {stats.hostname}</span>
                  <span style={s.infoPill}>⚙️ Arch: {stats.arch}</span>
                  <span style={s.infoPill}>🧠 CPUs: {stats.cpuCount}</span>
                  <span style={s.infoPill}>💾 Total RAM: {fmt(stats.totalMemory)}</span>
                  <span style={s.infoPill}>🕐 Last update: {new Date(stats.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
