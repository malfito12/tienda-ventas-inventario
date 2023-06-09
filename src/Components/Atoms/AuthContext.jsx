import React, { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

const ipcRenderer = window.require('electron').ipcRenderer



export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [idSuc, setIdSuc] = useState([])
    const [sucName, setSucName] = useState([])
    const [isAuthenticated,setIsAuthenticated]=useState(window.sessionStorage.getItem('login')??false)

    //-------------------------------------------------------------------
    const secondLogin=useCallback(function(){
        window.sessionStorage.setItem('login',true)
        setIsAuthenticated(true)
    },[])
    const secondLoguot=useCallback(function(){
        window.sessionStorage.removeItem('user')
        window.sessionStorage.removeItem('login')
        window.sessionStorage.removeItem('rol')
        window.sessionStorage.removeItem('user_name')
        setIsAuthenticated(false)
    },[])
    const setIdSucursal = (data) => {
        setIdSuc(data.sucursal_id)
        setSucName(data.sucursal_name)
    }

    const value=useMemo(()=>({
        secondLogin,secondLoguot,isAuthenticated,setIdSucursal,idSuc,sucName
    }),[secondLogin,secondLoguot,isAuthenticated,setIdSucursal,idSuc,sucName])

    //-------------------------------------------------------------------

    // const login = async (data) => {
    //     try {
    //         await ipcRenderer.invoke('login', data)
    //             .then(resp => {
    //                 var response = JSON.parse(resp)
    //                 if (response.status === 300) {
    //                     Swal.fire('Error', response.message, 'error')
    //                     return
    //                 }

    //                 sessionStorage.setItem('user',response.user_id)
    //                 setUser(response.user_id)
    //                 window.location = '/home'
    //             })
    //     } catch (error) {
    //         Swal.fire('Error', error, 'error')
    //         console.log(error)
    //     }
    // }
    // const logout = async () => {
    //     sessionStorage.removeItem('user')
    //     window.location = '/'
    // }

    
    return (
        // <AuthContext.Provider value={{ login, logout, setIdSucursal, idSuc, user }}>{children}</AuthContext.Provider>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}