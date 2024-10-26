import { useState } from 'react'

interface ToggleProps {
  isOn: boolean
  onClick: () => void
}

const Toggle: React.FC<ToggleProps> = ({ isOn = true, onClick }) => {
  const [on, setOn] = useState(isOn)

  const handleClick = () => {
    toggleState()
    onClick()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      toggleState()
    }
  }

  const toggleState = () => {
    setOn(!on)
  }

  return (
    <div
      className="bg-zinc-950 rounded-full flex items-center p-[2px] w-9 cursor-pointer"
      style={{ justifyContent: on ? 'flex-end' : 'flex-start' }}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <span className="rounded-full w-[18px] h-[18px] bg-white" />
    </div>
  )
}

export default Toggle
