import { FiBox } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { DndContext, useDraggable } from '@dnd-kit/core'
import { useHotkeys } from 'react-hotkeys-hook'
import { faker } from '@faker-js/faker'
import styles from './Welcome.module.css'
import { Badge } from '@/components/ui/badge'

const DraggableText = ({ children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'footer-text',
  })
  
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: 'grab',
      }
    : { cursor: 'grab' }

  return (
    <p 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className="text-xs text-zinc-400"
      style={style}
    >
      {children}
    </p>
  )
}

const Welcome = () => {
  useHotkeys('ctrl+/', () => {
    alert('hello')
  })

  return (
    <div className="center-content h-screen flex-col gap-4">
      <motion.div
        animate={{ y: -20 }}
        className={`${styles.wrapper} flex flex-col justify-center items-center gap-4`}
      >
        <FiBox size={40} />

        <p className="font-bold">Protobox</p>
      </motion.div>
      <Badge variant="secondary">Last updated {faker.date.recent().toLocaleDateString()}</Badge>
      <DndContext>
        <DraggableText>
          Created with 🖤 by {faker.person.fullName()}
        </DraggableText>
      </DndContext>
    </div>
  )
}

export default Welcome
