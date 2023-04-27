import React from 'react'
import { AuthProvider } from './Components/Atoms/AuthContext'
import Navigation from './Components/Atoms/Navigation'


const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider >
  )
}

export default App