
import React from 'react'
import './App.css'
import {

  Routes,
  Route
} from "react-router-dom";
import Chat from './components/Chat';
import Home from './components/Home';


const App = () => {
  return (
    <div className='App'>
    <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/chat" element={<Chat/>} />
        
  </Routes>
  </div>
  )
}

export default App