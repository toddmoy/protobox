import React from 'react'

interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({
  label = '',
  checked,
  onChange,
  disabled,
  className = '',
  style,
  ...rest
}) => {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) onChange(e.target.checked)
  }

  const cn = {
    base: [
      'rounded-full',
      'flex',
      'items-center',
      'p-0.5',
      'w-9',
      'focus-visible:outline-offset-2',
      'outline-purple-400',
    ],
    unchecked: ['bg-zinc-900'],
    checked: ['bg-green-500'],
    disabled: ['opacity-50 cursor-default pointer-events-none'],
    enabled: ['cursor-pointer'],
  }

  const classes =
    [
      ...cn.base,
      checked ? cn.checked : cn.unchecked,
      disabled ? cn.disabled : cn.enabled,
    ].join(' ') +
    ' ' +
    className

  return (
    <label>
      <span className="hidden">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        aria-checked={checked}
        role="switch"
        className="sr-only"
        {...rest}
      />
      <span aria-hidden="true" className={classes} style={{ ...style }}>
        <span
          className={`inline-block bg-white rounded-full w-[18px] h-[18px] shadow-md transform transition-transform duration-100 ${
            checked ? 'translate-x-[14px]' : 'translate-x-0 '
          }`}
        />
      </span>
    </label>
  )
}

export default Toggle
