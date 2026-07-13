import { memo } from 'react'

const Toggle = memo(function Toggle({ checked, onChange, label, disabled = false }) {
  const isChecked = Boolean(checked)

  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!isChecked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none
          ${isChecked ? 'bg-[var(--color-olive)]' : 'bg-[var(--color-cream-line)]'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-out
            ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      {label && <span className="text-sm font-medium text-[var(--color-bark)]/80">{label}</span>}
    </label>
  )
})

export default Toggle
