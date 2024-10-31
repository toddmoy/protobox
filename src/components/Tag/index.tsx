import { CSSProperties } from 'react'
import { FiX } from 'react-icons/fi'

interface TagProps {
  label?: string
  icon?: ReactNode
  size?: 'small' | 'medium'
  color?: 'zinc' | 'red' | 'blue' | 'purple'
  className?: string
  style?: CSSProperties
  isRemovable?: boolean
  onClick?: () => void
  onRemove?: () => void
}

const Tag: React.FC<TagProps> = ({
  label = 'Label',
  icon,
  size = 'small',
  color = 'zinc',
  className,
  style,
  isRemovable = false,
  onClick,
  onRemove,
}) => {
  const cn = {
    base: [
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-1',
      'select-none',
    ],
    size: {
      small: ['px-2 py-1 text-xs rounded-md'],
      medium: ['px-4 py-2 text-md rounded-lg'],
    },
    color: {
      zinc: ['bg-zinc-950 text-white fill-white'],
      red: ['bg-red-500 text-white fill-white'],
      blue: ['bg-blue-500 text-white fill-white'],
      purple: ['bg-purple-500 text-white fill-white'],
    },
  }

  const classes =
    [...cn.base, ...cn.size[size], ...cn.color[color]].join(' ') +
    ' ' +
    className

  return (
    <div className={classes} style={style} onClick={onClick}>
      <div className="flex gap-1 items-center justify-center">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      {isRemovable && <CloseButton onClick={onRemove} />}
    </div>
  )
}

interface CloseButtonProps {
  onClick?: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="hover:bg-black/20 cursor-pointer rounded-sm focus-visible:outline-offset-2 focus-visible:outline-purple-400"
  >
    <FiX />
  </button>
)

export default Tag
