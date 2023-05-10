import { Button, CircularProgress, Container, Grid, IconButton, InputAdornment, InputLabel, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useContext, useRef, useState } from 'react'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Components/Atoms/AuthContext';

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

const Login = () => {
    const { secondLogin } = useContext(AuthContext)
    const classes = useStyles()
    const [viewPass, setViewPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const userName = useRef()
    const userPass = useRef()

    const reViewPass = () => {
        setViewPass(!viewPass)
    }
    const iniciarSesion = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            user_name: userName.current.value,
            user_pass: userPass.current.value
        }
        await ipcRenderer.invoke('login', data)
            .then(resp => {
                var response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                secondLogin()
                window.sessionStorage.setItem('user', response.user_id)
                window.sessionStorage.setItem('user_name', response.people_name)
                window.sessionStorage.setItem('rol', response.rol_name)
            })
            .catch(err => Toast.fire({ icon: 'error', title: err }))
            .finally(() => setLoading(false))
    }
    return (
        <Container fixed>
            <div className={classes.form}>

                <Typography variant='h5' align='center' className={classes.inputTextTitle}>INICIAR SESION</Typography>
                <Grid container justifyContent='center' alignItems='center'>
                    <form onSubmit={iniciarSesion}>
                        <Grid item xs={12}>
                            <div className={classes.inputText}>
                                <InputLabel className={classes.inputText} shrink >Nombre de Usuario</InputLabel>
                                <TextField
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    inputRef={userName}
                                    required
                                    style={{ background: 'white', borderRadius: 5 }}
                                />
                            </div>
                            <div className={classes.inputText}>
                                <InputLabel className={classes.inputText} shrink >Contraseña</InputLabel>
                                <TextField
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    inputRef={userPass}
                                    type={viewPass ? 'type' : 'password'}
                                    style={{ background: 'white', borderRadius: 5 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={reViewPass}>
                                                    {viewPass ? <VisibilityOffIcon /> : <VisibilityIcon />}

                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                            <div className={classes.inputText}>
                                <Button disabled={loading} type='submit' variant='contained' style={{ background: '#43a047', color: 'white',textTransform: 'capitalize' }} fullWidth>{loading?<CircularProgress style={{width:30,height:30}} />:'Iniciar Sesión'}</Button>
                            </div>
                        </Grid>
                    </form>
                </Grid>
            </div>
        </Container >
    )
}

export default Login

const useStyles = makeStyles((theme) => ({
    inputTextTitle: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    inputText: {
        marginTop: 10,
        marginBottom: 10
    },
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '80vh',
    }
}))