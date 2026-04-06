import { useState } from 'react'
import './App.css'
import CheckInForm from './CheckInForm'

function App() {
  const [showForm, setShowForm] = useState(false)

  if (showForm) {
    return <CheckInForm />
  }

  return (
    <div className="page">
      <header className="navbar">
        <span className="logo-text">Astria</span>
        <nav>
          <a href="#">Sign In</a>
          <button onClick={() => setShowForm(true)} className="btn-nav">Get Started</button>
        </nav>
      </header>

      <main className="hero">
        <h1>Your day, <span className="highlight">one step at a time.</span></h1>
        <p className="subtitle">
          Astria helps students plan their day, break down tasks, and get started with their tasks
          without being overwhelmed. Designed for the way your brain works.
        </p>
        <button className="btn-primary" onClick={() => setShowForm(true)}>Start Planning Today</button>
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
