import './PlanResult.css'

function PlanResult({ plan, userName, onStartOver }) {
  return (
    <div className="plan-page">
      <header className="navbar">
        <span className="logo-text">Astria</span>
        <button className="btn-nav" onClick={onStartOver}>New Check-In</button>
      </header>

      <div className="plan-container">
        <h1 className="plan-greeting">
          Hey {userName}, here's your plan.
        </h1>
        <p className="focus-message">{plan.focusMessage}</p>

        <div className="start-here">
          <span className="start-label">Start here</span>
          <p className="start-text">{plan.startHere}</p>
        </div>

        <div className="priorities-section">
          <h2>Top Priorities</h2>
          <ol className="priorities-list">
            {plan.priorities.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </div>

        <div className="task-plans-section">
          <h2>Your Tasks, Broken Down</h2>
          {plan.taskPlans.map((tp, i) => (
            <div className="task-plan-card" key={i}>
              <h3>{tp.task}</h3>
              <ol className="step-list">
                {tp.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="encouragements-section">
          {plan.encouragements.map((msg, i) => (
            <p className="encouragement" key={i}>{msg}</p>
          ))}
        </div>

        <button className="btn-primary" onClick={onStartOver}>
          Start a New Check-In
        </button>
      </div>
    </div>
  )
}

export default PlanResult
