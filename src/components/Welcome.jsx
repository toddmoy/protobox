import { FiBox } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'
import styles from './Welcome.module.css'

const Welcome = () => {
  useHotkeys('ctrl+/', () => { alert("hello") })
    
  return (<motion.div
    animate={{ y: -20 }}
    className={`${styles.wrapper} flex flex-col justify-center items-center gap-4`}
  >
    <FiBox size={40} />
    <p className="font-bold">Protobox</p>
  </motion.div>
)}

export default Welcome
