import './App.css'
import Welcome from './components/Welcome'
import { faker } from '@faker-js/faker'

function App() {
  return (
    <div className="center-content h-screen flex-col gap-4">
      <Welcome />
      <p className="text-xs text-zinc-400">
        Made with 🖤 by {faker.person.fullName()}
      </p>
    </div>
  )
}

export default App
