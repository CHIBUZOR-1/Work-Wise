import React from 'react'
import ScrollTop from './Components/ScrollTop'
import { Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'

const App = () => {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/home' element={<Homepage />}/>
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </>
  )
}
 
export default App
