import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  color?: 'zinc' | 'red' | 'blue' | 'purple'
}

const Button: React.FC<ButtonProps> = ({
  label = 'Label',
  leadingIcon,
  trailingIcon,
  className,
  style,
  disabled,
  color = 'zinc',
  ...rest
}) => {
  const cn = {
    base: [
      'rounded-lg',
      'px-4',
      'py-2',
      'select-none',
      'flex',
      'justify-center',
      'items-center',
      'gap-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-purple-400',
    ],
    color: {
      zinc: ['bg-zinc-900 hover:bg-zinc-950 text-white fill-white'],
      red: ['bg-red-500 hover:bg-red-700 text-white fill-white'],
      blue: ['bg-blue-500 hover:bg-blue-700 text-white fill-white'],
      purple: ['bg-purple-500 hover:bg-purple-700 text-white fill-white'],
    },
    disabled: ['opacity-50 cursor-default pointer-events-none'],
    enabled: ['cursor-pointer'],
  }

  const classes =
    [...cn.base, ...cn.color[color], disabled ? cn.disabled : cn.enabled].join(
      ' '
    ) +
    ' ' +
    className

  return (
    <button className={classes} {...rest}>
      {leadingIcon && <ButtonIcon icon={leadingIcon} />}
      <span>
        {label}
        {className}
      </span>
      {trailingIcon && <ButtonIcon icon={trailingIcon} />}
    </button>
  )
}

interface ButtonIconProps {
  icon: ReactNode
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ icon }) => <span>{icon}</span>

export default Button
