import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../Atoms/AuthContext'

const RouterPublic = () => {
    const {isAuthenticated}=useContext(AuthContext)
    if(isAuthenticated){
        return(
            <Navigate to='/home' />
        )
    }
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default RouterPublic
