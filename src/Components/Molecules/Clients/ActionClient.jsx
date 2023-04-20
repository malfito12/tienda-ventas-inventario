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
            user_id: sessionStorage.getItem('user')
        }
        // console.log(data)
        await ipcRenderer.invoke('register-client', data)
            .then(resp=>{
                var response=JSON.parse(resp)
                if(response.status===300){
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                Toast.fire({ icon: 'success', title: response.message })
                openCloseModal()
                props.getClients()
            })
            .catch(err=>Toast.fire({ icon: 'error', title: err }))
    }
    return (
        <>
            <Button onClick={openCloseModal} variant='outlined' size='small' className={classes.buttonSave} endIcon={<AddToPhotosTwoToneIcon />} style={{ textTransform: 'capitalize' }}>Registrar Cliente</Button>
            <Dialog open={openModal} onClose={openCloseModal} maxWidth='xs'>
                <Paper component={Box} p={3}>
                    <Typography variant='subtitle2' align='center'>REGISTRAR CLIENTE</Typography>
                    <form onSubmit={postClient}>
                        <Grid container>
                            <label style={{ marginBottom: 5 }}>Nombre de Cliente</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_name}
                                required
                            />
                            <label style={{ marginBottom: 5 }}>Apellido Paterno</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_surname_p}
                                required
                            />
                            <label style={{ marginBottom: 5 }}>Apellido Materno</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_surname_m}
                                required
                            />
                            <label style={{ marginBottom: 5 }}>Cedula de Identidad</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_ci}
                                required
                            />
                            <label style={{ marginBottom: 5 }}>Numero de Telefono/Celular</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_phone}
                                required
                                type='number'
                            />
                            <label style={{ marginBottom: 5 }}>Dirección</label>
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
export function UpdateClient(props) {
    const [openModal, setOpenModal] = useState(false)
    const client_name = useRef()
    const client_surname_p = useRef()
    const client_surname_m = useRef()
    const client_ci = useRef()
    const client_phone = useRef()
    const client_address = useRef()
    const classes = useStyles()
    const openCloseModal = () => {
        setOpenModal(!openModal)
    }

    const updateClientSpecific = async(e) => {
        e.preventDefault()
        const data = {
            client_name: client_name.current.value,
            client_surname_p: client_surname_p.current.value,
            client_surname_m: client_surname_m.current.value,
            client_ci: client_ci.current.value,
            client_phone: client_phone.current.value,
            client_address: client_address.current.value,
            client_id:props.data.client_id
        }
        await ipcRenderer.invoke(`update-client`,data)
        .then(resp=>{
            var response=JSON.parse(resp)
            if(response.status===300){
                Toast.fire({ icon: 'error', title: response.message })
                return
            }
            Toast.fire({ icon: 'success', title: response.message })
            props.getClients()
            openCloseModal()
        })
        .catch(err=>Toast.fire({ icon: 'error', title: err }))
    }
    return (
        <>
            <Button onClick={() => openCloseModal()} color='primary' style={{ textTransform: 'capitalize' }} >Actualizar</Button>
            <Dialog open={openModal} onClose={openCloseModal} maxWidth='xs'>
                <Paper component={Box} p={3}>
                    <Typography variant='subtitle2' align='center'>REGISTRAR CLIENTE</Typography>
                    <form onSubmit={updateClientSpecific}>
                        <Grid container>
                            <label style={{ marginBottom: 5 }}>Nombre de Cliente</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_name}
                                required
                                defaultValue={props.data.client_name}
                            />
                            <label style={{ marginBottom: 5 }}>Apellido Paterno</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_surname_p}
                                required
                                defaultValue={props.data.client_surname_p}
                            />
                            <label style={{ marginBottom: 5 }}>Apellido Materno</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_surname_m}
                                required
                                defaultValue={props.data.client_surname_m}
                            />
                            <label style={{ marginBottom: 5 }}>Cedula de Identidad</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_ci}
                                required
                                defaultValue={props.data.client_ci}
                            />
                            <label style={{ marginBottom: 5 }}>Numero de Telefono/Celular</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_phone}
                                required
                                type='number'
                                defaultValue={props.data.client_phone}
                            />
                            <label style={{ marginBottom: 5 }}>Dirección</label>
                            <TextField
                                variant='outlined'
                                fullWidth
                                size='small'
                                className={classes.alignText}
                                inputRef={client_address}
                                defaultValue={props.data.client_address}
                            />
                            <Button endIcon={<SaveIcon />} type='submit' variant='contained' style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }} fullWidth>Guardar</Button>
                        </Grid>
                    </form>
                </Paper>
            </Dialog>
        </>
    )
}
export function DeleteClient(props) {

    const openCloseModalDelete = (id) => {
        // console.log(id)
        Swal.fire({
          title: 'Estas Seguro de Eliminar?',
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          text: "Los datos del Cliente se Eliminará por completo!!",
          icon: 'warning',
        }).then(async resp => {
          if (resp.isConfirmed) {
            // deleteProduct()
            await ipcRenderer.invoke('delete-client', id)
              .then(resp => {
                const response = JSON.parse(resp)
                if (response.status === 300) {
                  Toast.fire({ icon: 'error', title: response.message })
                  return
                }
                Toast.fire({ icon: 'success', title: response.message })
                props.getClients()
              })
              .catch(err=>Toast.fire({ icon: 'error', title: err }))
          }
        })
      }
    return (
        <>
        <Button onClick={()=>openCloseModalDelete(props.data.client_id)}  color='secondary' style={{ textTransform: 'capitalize' }} >Eliminar</Button>
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
        marginBottom: 15
    }
}))