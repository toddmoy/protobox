import { FiX } from 'react-icons/fi'

interface TagProps {
  label?: string
  icon?: ReactNode
  isRemovable?: boolean
  onClick?: () => void
  onRemove?: () => void
}

const Tag: React.FC<TagProps> = ({
  label = 'Label',
  icon,
  isRemovable = false,
  onClick,
  onRemove,
}) => (
  <div
    className="bg-zinc-950 text-white fill-white px-2 py-1 rounded-md text-xs flex items-center justify-center gap-1 select-none"
    onClick={onClick}
  >
    <div className="flex gap-1 items-center justify-center">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
    {isRemovable && <CloseButton onClick={onRemove} />}
  </div>
)

interface CloseButtonProps {
  onClick?: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="hover:bg-white/20 cursor-pointer rounded-sm"
  >
    <FiX />
  </button>
)

export default Tag
