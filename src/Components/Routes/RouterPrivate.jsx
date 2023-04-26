import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../Atoms/AuthContext'

const RouterPrivate = () => {
    const {isAuthenticated}=useContext(AuthContext)
    if(!isAuthenticated){
        return(
            <Navigate to='/' />
        )
    }
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default RouterPrivate
