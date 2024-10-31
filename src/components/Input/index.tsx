import { ChangeEvent, ReactNode, useState } from 'react'

interface InputProps {
  placeholder?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  onChange?: () => void
}

const Input: React.FC<InputProps> = ({
  placeholder,
  leadingIcon,
  trailingIcon,
  onChange,
}) => {
  const [value, setValue] = useState('')

  const handleChange = (e: ChangeEvent) => {
    setValue(e.target.value)
    if (onChange) {
      onChange()
    }
  }

  return (
    <FieldWrapper>
      {leadingIcon && (
        <InputIcon icon={leadingIcon} className="absolute left-2" />
      )}
      <input
        className={`bg-transparent text-base py-2 rounded-lg w-full focus-visible:outline-offset-4 focus-visible:outline-purple-400 ${leadingIcon ? 'pl-7' : 'pl-4'}  ${trailingIcon ? 'pr-7' : 'pr-4'}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {trailingIcon && (
        <InputIcon icon={trailingIcon} className="absolute right-2" />
      )}
    </FieldWrapper>
  )
}

interface FieldWrapperProps {
  children: ReactNode
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ children }) => (
  <div className="border border-zinc-300 rounded-lg flex items-center justify-center relative w-full">
    {children}
  </div>
)

interface InputIconProps {
  icon: ReactNode
  className?: string
}

const InputIcon: React.FC<InputIconProps> = ({ icon, className }) => (
  <span className={className}>{icon}</span>
)

export default Input
