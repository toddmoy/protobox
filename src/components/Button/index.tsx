import { CSSProperties, ReactNode } from 'react'

interface ButtonProps {
  label?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  className?: string
  style?: CSSProperties
}

const Button: React.FC<ButtonProps> = ({
  label = 'Label',
  leadingIcon,
  trailingIcon,
  className,
  style,
}) => {
  const cn = {
    base: [
      'rounded-lg',
      'bg-zinc-950',
      'hover:bg-zinc-700',
      'text-white',
      'fill-white',
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
  }

  const classes = [...cn.base].join(' ') + ' ' + className

  return (
    <button className={classes} style={style}>
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
