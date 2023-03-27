import React, { createContext, useEffect, useReducer, useState } from 'react'
import Swal from 'sweetalert2'
const ipcRenderer = window.require('electron').ipcRenderer



export const AuthContext = createContext()
// const inicialState = () => {
//     const user = localStorage.getItem('user')
//     return user
// }

// const verify = (state = inicialState(), action = {}) => {
//     if (action.type === 'USER') {
//         localStorage.setItem('user_id', action.user)
//         const localData = localStorage.getItem('user_id')
//         if (localData) {
//             return localData
//         } else {
//             return state
//         }
//     }
//     // console.log(localData)
// }

export const AuthProvider = ({ children }) => {
    const [idSuc, setIdSuc] = useState([])
    // const [user, dispach] = useReducer(verify, [], () => {
    //     const localData = localStorage.getItem('user_id')
    //     return localData ? localData : []
    // })
    // useEffect(() => {
    //     // localStorage.setItem('user_id', user)
    // }, [user])
    const [user, setUser] = useState(false)
    const login = async (data) => {
        try {
            await ipcRenderer.invoke('login', data)
                .then(resp => {
                    var response = JSON.parse(resp)
                    if (response.status === 300) {
                        Swal.fire('Error', response.message, 'error')
                        return
                    }
                    // dispach({ type: 'USER', user: response.user_id})
                    // localStorage.setItem('user',response.user_id)
                    sessionStorage.setItem('user',response.user_id)
                    setUser(response.user_id)
                    window.location = '/home'
                })
        } catch (error) {
            Swal.fire('Error', error, 'error')
            console.log(error)
        }
        // if (data.user_name === 'malfito12' && data.user_pass === 'vivabraun123') {
        // } else {
        //     // console.log('error')
        // }
    }
    const logout = async () => {
        // localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        window.location = '/'
    }

    const setIdSucursal = (id) => {
        setIdSuc(id)
    }
    return (
        <AuthContext.Provider value={{ login, logout, setIdSucursal, idSuc, user }}>{children}</AuthContext.Provider>
    )
}