import './App.css'
import Welcome from './components/Welcome'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewPage from './pages/newPage'
import PositionTest from './pages/PositionTest'
import TypewriterDemo from './pages/TypewriterDemo'
import LevaDemo from './pages/LevaDemo'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Welcome} />
        <Route path="/new-page" Component={NewPage} />
        <Route path="/position-test" Component={PositionTest} />
        <Route path="/typewriter-demo" Component={TypewriterDemo} />
        <Route path="/leva-demo" Component={LevaDemo} />
      </Routes>
    </BrowserRouter>
  )
}
