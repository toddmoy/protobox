import './App.css'
import Welcome from './components/Welcome'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewPage from './pages/newPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Welcome} />
        <Route path="/new-page" Component={NewPage} />
      </Routes>
    </BrowserRouter>
  )
}
