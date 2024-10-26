import { ReactNode } from 'react'

interface ButtonProps {
  label?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const Button: React.FC<ButtonProps> = ({
  label = 'Label',
  leadingIcon,
  trailingIcon,
}) => (
  <button className="rounded-lg bg-zinc-950 hover:bg-zinc-700 text-white fill-white px-4 py-2 select-none flex justify-center items-center gap-2">
    {leadingIcon && <ButtonIcon icon={leadingIcon} />}
    <span>{label}</span>
    {trailingIcon && <ButtonIcon icon={trailingIcon} />}
  </button>
)

interface ButtonIconProps {
  icon: ReactNode
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ icon }) => <span>{icon}</span>

export default Button
