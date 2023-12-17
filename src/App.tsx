import { useEffect } from 'react'
import  socketIO  from 'socket.io-client'
import './App.css'

const WS = import.meta.env.VITE_BASE_URL;

function App() {
  useEffect(() => { socketIO(WS); }, []);
  return (
    <div className='App w-screen h-screen flex items-center justify-center'>
      <button className='bg-rose-400 py-2 px-8 rounded-lg text-lg hover:bg-rose-600 text-white duration-300'>
        Start new meeting
      </button>
    </div>
  )
}

export default App
