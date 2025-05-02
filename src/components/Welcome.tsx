import { FiBox } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'
import { faker } from '@faker-js/faker'
import styles from './Welcome.module.css'
import { Badge } from '@/components/ui/badge'

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
      <p className="text-xs text-zinc-400">Created with 🖤 by {faker.person.fullName()}</p>
    </div>
  )
}

export default Welcome
