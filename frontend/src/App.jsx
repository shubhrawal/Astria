import { useState, useEffect } from 'react'
import './App.css'
import CheckIn from './CheckIn.jsx'
import PlanResult from './PlanResult.jsx'

function App() {
  const [page, setPage] = useState('landing')
  const [plan, setPlan] = useState(null)
  const [userName, setUserName] = useState('')
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('astria_xp') || '0', 10)
    setTotalXP(saved)
  }, [])

  function handlePlanGenerated(planData, name) {
    setPlan(planData)
    setUserName(name)
    setPage('result')
  }

  function handleStartOver() {
    setPlan(null)
    setUserName('')
    setPage('checkin')
  }

  function handleRewardClaimed(xp) {
    const newTotal = totalXP + xp
    localStorage.setItem('astria_xp', newTotal.toString())
    setTotalXP(newTotal)
  }

  if (page === 'checkin') {
    return <CheckIn onPlanGenerated={handlePlanGenerated} onBack={() => setPage('landing')} />
  }

  if (page === 'result' && plan) {
    return (
      <PlanResult
        plan={plan}
        userName={userName}
        onStartOver={handleStartOver}
        onRewardClaimed={handleRewardClaimed}
      />
    )
  }

  return (
    <div className="page">
      <header className="navbar">
        <span className="logo-text">Astria</span>
        <nav>
          {totalXP > 0 && (
            <div className="xp-badge">
              <span className="xp-badge-icon">⚡</span>
              <span className="xp-badge-text">{totalXP} XP</span>
            </div>
          )}
          <button className="btn-nav" onClick={() => setPage('checkin')}>Get Started</button>
        </nav>
      </header>

      <main className="hero">
        {totalXP > 0 && (
          <div className="xp-hero-widget">
            <span className="xp-hero-icon">⚡</span>
            <div className="xp-hero-info">
              <span className="xp-hero-total">{totalXP} XP</span>
              <span className="xp-hero-label">earned so far — keep it going</span>
            </div>
          </div>
        )}
        <h1>Your day, <span className="highlight">one step at a time.</span></h1>
        <p className="subtitle">
          Astria helps students plan their day, break down tasks, and get started with their tasks
          without being overwhelmed. Designed for the way your brain works.
        </p>
        <button className="btn-primary" onClick={() => setPage('checkin')}>Start Planning Today</button>
      </main>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Plan Your Day</h3>
          <p>Build a clear, manageable schedule that fits around your energy and focus.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Break It Down</h3>
          <p>Every task gets split into small, clear steps so nothing feels too big to start.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Just Get Going</h3>
          <p>Stuck between tasks? Astria nudges you forward with low-friction guidance.</p>
        </div>
      </section>
    </div>
  )
}

export default App