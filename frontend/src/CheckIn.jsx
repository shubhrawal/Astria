import { useState } from 'react'
import './CheckIn.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function CheckIn({ onPlanGenerated, onBack }) {
  const [name, setName] = useState('')
  const [energyLevel, setEnergyLevel] = useState(5)
  const [stressLevel, setStressLevel] = useState(5)
  const [availableMinutes, setAvailableMinutes] = useState(30)
  const [tasks, setTasks] = useState([''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function addTask() {
    setTasks([...tasks, ''])
  }

  function updateTask(index, value) {
    const updated = [...tasks]
    updated[index] = value
    setTasks(updated)
  }

  function removeTask(index) {
    if (tasks.length <= 1) return
    setTasks(tasks.filter((_, i) => i !== index))
  }

  function formatTime(minutes) {
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const filteredTasks = tasks.map(t => t.trim()).filter(Boolean)
    if (filteredTasks.length === 0) {
      setError('Add at least one task.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          energyLevel,
          stressLevel,
          availableMinutes,
          tasks: filteredTasks,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || `Server error (${res.status})`)
      }

      const plan = await res.json()
      onPlanGenerated(plan, name.trim())
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkin-page">
      <header className="navbar">
        <button className="logo-text back-btn" onClick={onBack}>Astria</button>
        <span className="checkin-title">Daily Check-In</span>
      </header>

      <form className="checkin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">What's your name?</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="energy">
            Energy level
            <span className="level-badge">{energyLevel}/10</span>
          </label>
          <input
            id="energy"
            type="range"
            min={1}
            max={10}
            value={energyLevel}
            onChange={e => setEnergyLevel(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>Running on fumes</span>
            <span>Fully charged</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="stress">
            Stress level
            <span className="level-badge">{stressLevel}/10</span>
          </label>
          <input
            id="stress"
            type="range"
            min={1}
            max={10}
            value={stressLevel}
            onChange={e => setStressLevel(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>Pretty chill</span>
            <span>Very stressed</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="time">
            Available time
            <span className="level-badge">{formatTime(availableMinutes)}</span>
          </label>
          <input
            id="time"
            type="range"
            min={10}
            max={480}
            step={5}
            value={availableMinutes}
            onChange={e => setAvailableMinutes(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>10 min</span>
            <span>8 hours</span>
          </div>
        </div>

        <div className="form-group">
          <label>What do you need to get done?</label>
          <div className="task-list">
            {tasks.map((task, i) => (
              <div className="task-row" key={i}>
                <input
                  type="text"
                  placeholder={`Task ${i + 1}, e.g. "finish essay"`}
                  value={task}
                  onChange={e => updateTask(i, e.target.value)}
                />
                {tasks.length > 1 && (
                  <button
                    type="button"
                    className="remove-task"
                    onClick={() => removeTask(i)}
                    aria-label="Remove task"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="add-task" onClick={addTask}>
            + Add another task
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary submit-btn" disabled={loading}>
          {loading ? 'Building your plan...' : 'Build My Plan'}
        </button>
      </form>
    </div>
  )
}

export default CheckIn
