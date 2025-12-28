import { FiBox } from 'react-icons/fi'

const Welcome = () => (
  <div className="center-content h-screen bg-neutral-100">
    <div className="bg-white border border p-10 center-content flex-col gap-2 rounded-lg">
      <FiBox size={40} className="text-neutral-800" />
      <p className="text-neutral-800 font-bold">Protobox</p>
    </div>
  </div>
)

export default Welcome
