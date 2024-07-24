import { FiBox } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Welcome = () => (
  <motion.div
    animate={{ y: -20 }}
    class="flex flex-col justify-center items-center gap-4"
  >
    <FiBox size={40} />
    <p className="font-bold">Protobox</p>
  </motion.div>
)

export default Welcome
