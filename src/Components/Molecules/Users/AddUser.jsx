import { Box, Button, Dialog, Grid, IconButton, InputAdornment, makeStyles, Menu, MenuItem, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import Swal from 'sweetalert2';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import LockOpenSharpIcon from '@material-ui/icons/LockOpenSharp';
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const ipcRenderer = window.require('electron').ipcRenderer


const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
// se requiere personal de telecomunicaciones 63201893
export function AddUser(props) {
    // console.log(props.nose)
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)
    const [rols, setRols] = useState([])
    const name = useRef()
    const user_name = useRef()
    const user_email = useRef()
    const password = useRef()
    const repeat_password = useRef()
    const user_rol = useRef()

    const openCloseModalAdd = () => {
        setOpenModal(!openModal)
    }
    useEffect(() => {
        getRols()
    }, [])

    const getRols = async () => {
        await ipcRenderer.invoke('get-all-rols')
            .then(resp => setRols(JSON.parse(resp)))
            .catch(err => console.log(err))
    }
    //-------ADD USER------------------
    const postUser = async (e) => {
        e.preventDefault()
        if (password.current.value !== repeat_password.current.value) {
            Toast.fire({ icon: 'warning', title: 'Error, Verifique que las Contraseñas sean Iguales' })
            return
        }
        const data = {
            people_name: name.current.value,
            user_name: user_name.current.value,
            user_email: user_email.current.value,
            user_password: password.current.value,
            user_repeat_password: repeat_password.current.value,
            user_status: 'BAJA',
            rol_id: user_rol.current.value,
        }
        // console.log(data)
        await ipcRenderer.invoke('post-user', data)
            .then(resp => {
                const response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                Toast.fire({ icon: 'success', title: response.message })
                openCloseModalAdd()
                props.getUsers()
            })
            .catch(err => Toast.fire({ icon: 'error', title: err }))

    }
    return (
        <>
            <Button onClick={openCloseModalAdd} variant='contained' endIcon={<PersonAddTwoToneIcon />} size='small' className={classes.buttonSave} style={{ textTransform: 'capitalize' }}>Agregar Usuario</Button>
            <Dialog
                open={openModal}
                onClose={openCloseModalAdd}
                maxWidth='xs'
            >
                <Paper component={Box} p={2}>
                    <Typography className={classes.alignText} align='center'>AGREGAR USUARIO</Typography>
                    <Grid container>
                        <form onSubmit={postUser}>
                            <label>Nombre</label>
                            <TextField
                                inputRef={name}
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                            />
                            <label>Nombre Usuario</label>
                            <TextField
                                inputRef={user_name}
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                            />
                            <label>Correo Electronico</label>
                            <TextField
                                inputRef={user_email}
                                variant='outlined'
                                fullWidth
                                size='small'
                                type='email'
                                className={classes.alignText}
                            />
                            <label>Contraseña</label>
                            <TextField
                                inputRef={password}
                                variant='outlined'
                                fullWidth
                                size='small'
                                type='password'
                                className={classes.alignText}
                            />
                            <label>Repita Contraseña</label>
                            <TextField
                                inputRef={repeat_password}
                                variant='outlined'
                                fullWidth
                                size='small'
                                type='password'
                                className={classes.alignText}
                            />
                            <label>Rol de Usuario</label>
                            <TextField
                                inputRef={user_rol}
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                select
                                defaultValue=''
                            >
                                {rols.length > 0 ? (
                                    rols.map((e, index) => (<MenuItem key={index} value={e.rol_id}>{e.rol_name}</MenuItem>))
                                ) : null}
                            </TextField>
                            <div style={{ marginTop: 15 }}>
                                <Button endIcon={<SaveIcon />} type='submit' variant='contained' style={{ background: '#43a047', color: 'white' }} fullWidth>Registrar</Button>
                            </div>
                        </form>
                    </Grid>
                </Paper>
            </Dialog>
        </>
    )
}

export function EditUser(props) {
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)
    const [rols, setRols] = useState([])
    const name = useRef()
    const user_name = useRef()
    const user_email = useRef()
    const user_rol = useRef()

    useEffect(() => {
        getRols()
    }, [])

    const getRols = async () => {
        await ipcRenderer.invoke('get-all-rols')
            .then(resp => setRols(JSON.parse(resp)))
            .catch(err => console.log(err))
    }

    const openCloseModalEdit = () => {
        setOpenModal(!openModal)
    }

    const updateUser = async (e) => {
        e.preventDefault()
        const data = {
            people_name: name.current.value,
            user_name: user_name.current.value,
            user_email: user_email.current.value,
            rol_id: user_rol.current.value,
            user_id: props.data.user_id
        }
        await ipcRenderer.invoke('update-user', data)
            .then(resp => {
                const response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                openCloseModalEdit()
                Toast.fire({ icon: 'success', title: response.message })
                props.getUsers()
            })
            .catch(err => Toast.fire({ icon: 'error', title: err }))

    }
    return (
        <>
            <Tooltip title='Actualizar'>
                <IconButton onClick={openCloseModalEdit} size='small' style={{ background: '#fb8c00', color: 'white', marginRight: 5 }}>
                    <EditSharpIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={openModal}
                onClose={openCloseModalEdit}
                maxWidth='xs'
            >
                <Paper component={Box} p={2}>
                    <Typography variant='h6' align='center'>Actualizar Usuario</Typography>
                    <Grid container>
                        <form onSubmit={updateUser} >
                            <label>Nombre</label>
                            <TextField
                                inputRef={name}
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                defaultValue={props.data.people_name}
                            />
                            <label>Nombre Usuario</label>
                            <TextField
                                inputRef={user_name}
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                defaultValue={props.data.user_name}
                            />
                            <label>Correo Electronico</label>
                            <TextField
                                inputRef={user_email}
                                variant='outlined'
                                fullWidth
                                size='small'
                                type='email'
                                className={classes.alignText}
                                defaultValue={props.data.user_email}
                            />
                            <label>Rol de Usuario</label>
                            <TextField
                                inputRef={user_rol}
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                select
                                defaultValue={props.data.rol_id}
                            >
                                {rols.length > 0 ? (
                                    rols.map((e, index) => (<MenuItem key={index} value={e.rol_id}>{e.rol_name}</MenuItem>))
                                ) : null}
                            </TextField>
                            <div style={{ marginTop: 15 }}>
                                <Button endIcon={<SaveIcon />} type='submit' variant='contained' style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }} fullWidth>Guardar</Button>
                            </div>
                        </form>
                    </Grid>
                </Paper>
            </Dialog>
        </>
    )
}

export function DeleteUser(props) {
    // console.log(props.data.user_status)
    const [openDrop, setOpenDrop] = useState(null)
    const openDropDown = (e) => {
        setOpenDrop(e.currentTarget)
    }
    const closeDropDown = () => {
        setOpenDrop(null)
    }

    const deleteUser = async (num) => {
        // e.preventDefault()
        const data = {
            user_status: num,
            user_id: props.data.user_id
        }
        await ipcRenderer.invoke('status-user', data)
            .then(resp => {
                const response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                closeDropDown()
                Toast.fire({ icon: 'success', title: response.message })
                props.getUsers()
            })
            .catch(err => Toast.fire({ icon: 'error', title: err }))
    }
    return (
        <>
            <Tooltip title='Estado'>
                {props.data.user_status === 'BAJA'
                    ? <IconButton size='small' onClick={openDropDown} style={{ background: '#f44336', color: 'white' }}><LockSharpIcon /></IconButton>
                    : <IconButton size='small' onClick={openDropDown} style={{ background: '#43a047', color: 'white' }}><LockOpenSharpIcon /></IconButton>
                }
            </Tooltip>
            <Menu
                getContentAnchorEl={null}
                anchorEl={openDrop}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                open={Boolean(openDrop)}
                onClose={closeDropDown}
            >
                <MenuItem onClick={() => deleteUser(1)}>Activado</MenuItem>
                <MenuItem onClick={() => deleteUser(2)}>Desactivado</MenuItem>
            </Menu>
        </>
    )
}

export function CambioPass(props) {
    const [openModal, setOpenModal] = useState(false)
    const [viewPass1, setViewPass1] = useState(false)
    const [viewPass2, setViewPass2] = useState(false)
    const newPass = useRef()
    const repeatNewPass = useRef()
    const openCloseModalPass = () => {
        setOpenModal(!openModal)
    }
    const reViewPass1 = () => {
        setViewPass1(!viewPass1)
    }
    const reViewPass2 = () => {
        setViewPass2(!viewPass2)
    }

    const changeNewPass = async (e) => {
        e.preventDefault()
        if (newPass.current.value !== repeatNewPass.current.value) {
            Toast.fire({ icon: 'warning', title: 'Error, Verifique que las Contraseñas sean Iguales' })
            return
        }
        const data = {
            newPass: newPass.current.value,
            reNewPass: repeatNewPass.current.value,
            user_id: props.data.user_id
        }
        console.log(data)
        await ipcRenderer.invoke('change-new-pass', data)
            .then(resp => {
                var response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                Toast.fire({ icon: 'success', title: response.message })
                props.getUsers()
                openCloseModalPass()
            })
            .catch(err => Toast.fire({ icon: 'error', title: err }))
    }
    return (
        <>
            <Tooltip title='Cambiar Contraseña'>
                <IconButton onClick={openCloseModalPass} size='small' style={{ background: '#2196f3', color: 'white', marginRight: 5 }}>
                    <VpnKeyIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={openModal}
                onClose={openCloseModalPass}
                maxWidth='xs'
            >
                <Paper component={Box} p={2}>
                    <Typography align='center' variant='subtitle1'>Cambiar Contraseña</Typography>
                    <form onSubmit={changeNewPass}>
                        <label >Nueva Contraseña</label>
                        <TextField
                            variant='outlined'
                            size='small'
                            fullWidth
                            style={{ marginBottom: 10 }}
                            inputRef={newPass}
                            type={viewPass1 ? 'type' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={reViewPass1}>
                                            {viewPass1 ? <VisibilityOffIcon /> : <VisibilityIcon />}

                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <label >Repita Nueva Contraseña</label>
                        <TextField
                            variant='outlined'
                            size='small'
                            fullWidth
                            style={{ marginBottom: 10 }}
                            type={viewPass2 ? 'type' : 'password'}
                            inputRef={repeatNewPass}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={reViewPass2}>
                                            {viewPass2 ? <VisibilityOffIcon /> : <VisibilityIcon />}

                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button endIcon={<SaveIcon />} type='submit' variant='contained' style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }} fullWidth>Guardar</Button>
                    </form>
                </Paper>
            </Dialog>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    buttonSave: {
        background: '#43a047',
        color: 'white',
        marginBottom: 20,
    },
    alignText: {
        marginBottom: 10
    }
}))