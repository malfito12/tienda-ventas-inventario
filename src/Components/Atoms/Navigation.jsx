import React, { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../../Pages/Private/Home'
import AddSucursal from '../../Pages/Private/Sucursales/AddSucursal'
import Login from '../../Pages/Public/Login'
import MainDrawer from '../Organisms/MainDrawer'
import { AuthContext } from './AuthContext'

const Navigation = () => {
    const { user } = useContext(AuthContext)
    // const login=localStorage.getItem('user')
    const login=sessionStorage.getItem('user')
    // console.log(user)
    return (
        <BrowserRouter>
            {login && login ? (
                <div className='otro'>
                    <Routes>
                        <Route path='/home' element={<Home />} />
                        <Route path='/registro-sucursal' element={<AddSucursal />} />
                        <Route path='/maindrawer/*' element={<MainDrawer />} />
                    </Routes>
                </div>
            ) : (
                <Routes>
                    <Route path='/' element={<Login />} />
                </Routes>
            )}
        </BrowserRouter>
    )
}

export default Navigation