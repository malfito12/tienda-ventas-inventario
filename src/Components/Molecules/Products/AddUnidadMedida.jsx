import { Box, Button, Dialog, Grid, IconButton, InputLabel, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useContext, useRef, useState } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import CancelPresentationTwoToneIcon from '@material-ui/icons/CancelPresentationTwoTone';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Atoms/AuthContext';
const ipcRenderer = window.require('electron').ipcRenderer


export function AddUnidadMedida(props) {
  const { user } = useContext(AuthContext)
  const name_unidad = useRef()
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)

  const openCloseModal = () => {
    setOpenModal(!openModal)
  }

  //----------POST UNIDAD MEDIDA-----------------
  const postUnidadMedida = async (e) => {
    e.preventDefault()
    const data = {
      u_medida_name: name_unidad.current.value,
      // user_id:user
      user_id: sessionStorage.getItem('user')
    }
    // console.log(data)
    await ipcRenderer.invoke('post-unidad-medida', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Swal.fire('Error', response.message, 'error')
          openCloseModal()
          return
        }
        Swal.fire('Success', response.message, 'success')
        openCloseModal()
        props.getUnidades()
        e.target.reset()
      })
      .catch(err => Swal.fire('Error', err, 'error'))
  }
  return (
    <>
      <Button variant='contained' endIcon={<SaveIcon />} size='small' onClick={openCloseModal} className={classes.buttonSave}>Crear Unidad Medida</Button>
      <Dialog
        open={openModal}
        onClose={openCloseModal}
        maxWidth='md'
      >
        <Paper component={Box} p={2} >
          <div align='right'>
            <IconButton size='small' onClick={openCloseModal}>
              <CancelPresentationTwoToneIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </div>
          <Typography align='center'>Registrar</Typography>
          <Grid container >
            <form onSubmit={postUnidadMedida}>
              <div className={classes.inputText}>
                <InputLabel className={classes.inputText} shrink>Nombre de Unidad Medida</InputLabel>
                <TextField
                  variant='outlined'
                  size='small'
                  fullWidth
                  inputRef={name_unidad}
                  required
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <Button type='submit' variant='contained' style={{ background: '#43a047', color: 'white' }} fullWidth>Guardar</Button>
              </div>

            </form>
          </Grid>
        </Paper>
      </Dialog>
    </>
  )
}

export function EditUnidadMedida(props) {
  const classes = useStyles()
  const name_unidad = useRef()
  // console.log(props.data)
  const [openModal, setOpenModal] = useState(false)

  const openCloseModal = () => {
    setOpenModal(!openModal)
  }
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
  //-------------EDIT UNIDAD MEDIDA--------------
  const editUndiadMedida = async (e) => {
    e.preventDefault()
    const data = {
      u_medida_name: name_unidad.current.value,
      u_medida_id: props.data.u_medida_id
    }
    await ipcRenderer.invoke('update-unidad-medida', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        openCloseModal()
        props.getUnidad()
      })
      .catch(err => Toast.fire({ icon: 'error', title: err }))
  }
  return (
    <>
      <Button onClick={openCloseModal} size='small' color='primary'>edit</Button>
      <Dialog
        open={openModal}
        onClose={openCloseModal}
        maxWidth='md'
      >
        <Paper component={Box} p={2} >
          <div align='right'>
            <IconButton size='small' onClick={openCloseModal}>
              <CancelPresentationTwoToneIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </div>
          <Typography align='center'>Actualizar</Typography>
          <Grid container >
            <form onSubmit={editUndiadMedida}>
              <div className={classes.inputText}>
                <InputLabel className={classes.inputText} shrink>Nombre de Unidad Medida</InputLabel>
                <TextField
                  variant='outlined'
                  size='small'
                  fullWidth
                  inputRef={name_unidad}
                  required
                  defaultValue={props.data.u_medida_name}
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <Button type='submit' variant='contained' style={{ background: '#43a047', color: 'white' }} fullWidth>Guardar</Button>
              </div>

            </form>
          </Grid>
        </Paper>
      </Dialog>
    </>
  )
}

export function DeleteUnidadMedida(props) {
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

  //-------DELETE UNIDAD MEDIDA---------------------

  const openCloseModalDelete = (id) => {
    // console.log(id)
    Swal.fire({
      title: 'Estas Seguro de Eliminar?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      text: "La Unidad Medida se Eliminará por completo!!",
      icon: 'warning',
    }).then(async resp => {
      if (resp.isConfirmed) {
        // deleteProduct()
        await ipcRenderer.invoke('delete-unidad-medida', id)
          .then(resp => {
            const response = JSON.parse(resp)
            if (response.status === 300) {
              Toast.fire({ icon: 'error', title: response.message })
              return
            }
            Toast.fire({ icon: 'success', title: response.message })
            props.getUnidad()
          })
          .catch(err=>Toast.fire({ icon: 'error', title: err }))
      }
    })
  }
  return (
    <>
      <Button onClick={()=>openCloseModalDelete(props.data.u_medida_id)} size='small' color='secondary'>delete</Button>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  buttonSave: {
    background: '#43a047',
    color: 'white',
    marginBottom: 20,
  },
  inputText: {
    marginTop: 10,
    marginBottom: 10
  },
}))