import React from 'react'
import './ProgressBar.css'

interface ProgressBarProps {
  current: number
  max: number
  label: string
  subLabel?: string
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red'
}

export default function ProgressBar({
  current,
  max,
  label,
  subLabel,
  color = 'purple'
}: ProgressBarProps) {
  const percentage = Math.min(100, (current / max) * 100)
  const isFull = current >= max
  const isNearFull = percentage > 80

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="progress-label">
          <div className="label-text">{label}</div>
          {subLabel && <div className="sub-label">{subLabel}</div>}
        </div>
        <div className={`progress-count ${isFull ? 'full' : isNearFull ? 'near-full' : ''}`}>
          {current}/{max}
        </div>
      </div>
      <div className="progress-bar-wrapper">
        <div
          className={`progress-bar progress-${color}`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && <span className="progress-percentage">{Math.round(percentage)}%</span>}
        </div>
      </div>
      {isFull && <div className="progress-badge">Complet ✓</div>}
      {isNearFull && !isFull && <div className="progress-badge warning">Presque complet</div>}
    </div>
  )
}
