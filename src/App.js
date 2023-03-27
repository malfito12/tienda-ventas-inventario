import React, { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, AuthProvider } from './Components/Atoms/AuthContext'
import Navigation from './Components/Atoms/Navigation'
import MainDrawer from './Components/Organisms/MainDrawer'
import Home from './Pages/Private/Home'
import AddSucursal from './Pages/Private/Sucursales/AddSucursal'
import Login from './Pages/Public/Login'

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider >
  )
}

export default App