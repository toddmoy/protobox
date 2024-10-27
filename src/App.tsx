import './App.css'
import Welcome from './components/Welcome'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Parts from './pages/parts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Welcome} />
        <Route path="/parts" Component={Parts} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
