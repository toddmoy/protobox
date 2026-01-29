import { FiBox } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Welcome = () => (
  <div className="center-content h-screen bg-neutral-100">
    <div className="bg-white border border p-10 center-content flex-col gap-4 rounded-lg">
      <div className="center-content flex-col gap-2">
        <FiBox size={40} className="text-neutral-800" />
        <p className="text-neutral-800 font-bold">Protobox</p>
      </div>
      <Link
        to="/components"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        View Component Showcase
        <ArrowRight size={14} />
      </Link>
    </div>
  </div>
)

export default Welcome
