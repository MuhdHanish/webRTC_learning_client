import { Route, Routes } from 'react-router-dom'
import { Home, Room } from './pages'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/room/:id' element={<Room/>} />
    </Routes>
  )
}

export default App
