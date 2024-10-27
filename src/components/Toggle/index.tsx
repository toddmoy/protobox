import { useState, useEffect, CSSProperties } from 'react'

interface ToggleProps {
  isOn?: boolean
  onClick?: () => void
  onChange?: () => void
  className?: string
  style?: CSSProperties
  disabled?: boolean
}

const Toggle: React.FC<ToggleProps> = ({
  isOn = true,
  onClick,
  onChange,
  className,
  style,
  disabled = false,
}) => {
  const [on, setOn] = useState(isOn)

  const handleClick = () => {
    // Optimistically update state.
    toggleOnOff()

    if (onClick) {
      onClick()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      toggleOnOff()
    }
  }

  const toggleOnOff = () => {
    if (!disabled) {
      setOn(!on)
    }
  }

  useEffect(() => {
    if (onChange) {
      onChange()
    }
  }, [on])

  const cn = {
    base: [
      'bg-zinc-950',
      'rounded-full',
      'flex',
      'items-center',
      'p-[2px]',
      'w-9',
      'cursor-pointer',
      'focus-visible:outline-offset-2',
      'outline-purple-400',
    ],
    disabled: ['opacity-50 cursor-default'],
  }

  const classes =
    [...cn.base, disabled ? cn.disabled : ''].join(' ') + ' ' + className

  return (
    <div
      className={classes}
      style={{ justifyContent: on ? 'flex-end' : 'flex-start', ...style }}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <span className="rounded-full w-[18px] h-[18px] bg-white" />
    </div>
  )
}

export default Toggle
