import { Box, Button, Dialog, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import AddToPhotosTwoToneIcon from '@material-ui/icons/AddToPhotosTwoTone';
import SaveIcon from '@material-ui/icons/Save';
import Swal from 'sweetalert2';

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

export function AddClient(props) {
    const classes = useStyles()
    const [openModal, setOpenModal] = useState(false)
    const client_name = useRef()
    const client_surname_p = useRef()
    const client_surname_m = useRef()
    const client_ci = useRef()
    const client_phone = useRef()
    const client_address = useRef()


    const openCloseModal = () => {
        setOpenModal(!openModal)
    }

    const postClient = async (e) => {
        e.preventDefault()
        const data = {
            client_name: client_name.current.value,
            client_surname_p: client_surname_p.current.value,
            client_surname_m: client_surname_m.current.value,
            client_ci: client_ci.current.value,
            client_phone: client_phone.current.value,
            client_address: client_address.current.value,
            user_id:sessionStorage.getItem('user')
        }
        // console.log(data)
        await ipcRenderer.invoke('register-client', data)
            .then(resp => {
                const response = JSON.parse(resp)
                if (response === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                openCloseModal()
                Toast.fire({ icon: 'success', title: response.message })
                props.getClients()
            })
            .catch(err => console.log(err))
    }
    return (
        <>
            <Button onClick={openCloseModal} variant='outlined' size='small' className={classes.buttonSave} endIcon={<AddToPhotosTwoToneIcon />} style={{ textTransform: 'capitalize' }}>Registrar Cliente</Button>
            <Dialog open={openModal} onClose={openCloseModal} maxWidth='xs'>
                <Paper component={Box} p={2}>
                    <Typography variant='subtitle2' align='center'>REGISTRAR CLIENTE</Typography>
                    <form onSubmit={postClient}>
                        <Grid container>
                            <label >Nombre de Cliente</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_name}
                                required
                            />
                            <label>Apellido Paterno</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_surname_p}
                                required
                            />
                            <label>Apellido Materno</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_surname_m}
                                required
                            />
                            <label>Cedula de Identidad</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_ci}
                                required
                            />
                            <label>Numero de Telefono/Celular</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_phone}
                                required
                                type='number'
                            />
                            <label>Dirección</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_address}
                            />
                            <Button endIcon={<SaveIcon />} type='submit' variant='contained' style={{ background: '#43a047', color: 'white' }} fullWidth>Registrar</Button>
                        </Grid>
                    </form>
                </Paper>
            </Dialog>
        </>
    )
}
export function UpdateClient() {
    return (
        <></>
    )
}
export function DeleteClient() {
    return (
        <></>
    )
}


const useStyles = makeStyles((theme) => ({
    buttonSave: {
        background: '#43a047',
        color: 'white',
        marginBottom: 20,
    },
    alignText: {
        marginBottom: 15
    }
}))