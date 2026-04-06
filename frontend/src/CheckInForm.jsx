import { useState } from 'react'
import './CheckInForm.css'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function CheckInForm() {
  const [mood, setMood] = useState('neutral')
  const [energy, setEnergy] = useState('medium')
  const [tasks, setTasks] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const taskList = tasks
      .split('\n')
      .map(task => task.trim())
      .filter(task => task.length > 0)

    if (taskList.length === 0) {
      setError('Please enter at least one task')
      setLoading(false)
      return
    }

    if (!GEMINI_API_KEY) {
      setError('Missing VITE_GEMINI_API_KEY in your .env file')
      setLoading(false)
      return
    }

    const prompt = `You are Astria, an ADHD-friendly academic planner.
A student is checking in with the following:
- Mood: ${mood}
- Energy level: ${energy}
- Tasks they need to do today:
${taskList.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}

Give them a clear, friendly, step-by-step plan for their day.
Break each task into small, manageable steps.
Keep your tone warm and encouraging. Do not overwhelm them.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
          signal: AbortSignal.timeout(15000)
        }
      )

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error?.message || `API error: ${res.status}`)
      }

      const data = await res.json()
      const plan = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!plan) throw new Error('No response from Gemini')

      setResponse({ plan })
    } catch (err) {
      if (err.name === 'TimeoutError') {
        setError('Request timed out. Check your internet connection.')
      } else {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (response) {
    return (
      <div className="form-container">
        <button onClick={() => setResponse(null)} className="back-button">
          ← Back to planning
        </button>
        <div className="response-container">
          <h2>Your Plan</h2>
          {response.plan && (
            <div className="plan-content">
              {response.plan.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>How are you feeling today?</h2>
        <p className="form-subtitle">Tell us your mood, energy level, and what you need to do.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mood">Mood</label>
            <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)} required>
              <option value="great">Great 😊</option>
              <option value="good">Good 👍</option>
              <option value="neutral">Neutral 😐</option>
              <option value="stressed">Stressed 😰</option>
              <option value="overwhelmed">Overwhelmed 😵</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="energy">Energy Level</label>
            <select id="energy" value={energy} onChange={(e) => setEnergy(e.target.value)} required>
              <option value="high">High ⚡</option>
              <option value="medium">Medium 👀</option>
              <option value="low">Low 😴</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tasks">Tasks (one per line)</label>
            <textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Write a report\nStudy for math test\nClean room"}
              rows="5"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Generating plan...' : 'Create My Plan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckInForm
