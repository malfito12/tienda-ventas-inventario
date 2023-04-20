import { Box, Button, Dialog, Grid, IconButton, InputLabel, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useContext, useRef, useState } from 'react'
import CancelPresentationTwoToneIcon from '@material-ui/icons/CancelPresentationTwoTone';
import SaveIcon from '@material-ui/icons/Save';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Atoms/AuthContext';
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


export function AddTypeProduct(props) {
  const { idSuc } = useContext(AuthContext)
  const name_type = useRef()
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const openCloseModal = () => {
    setOpenModal(!openModal)
  }

  //----------POST TIPO PRODUCTO-----------------
  const postTypeProduct = async (e) => {
    e.preventDefault()
    const data = {
      type_name: name_type.current.value,
      sucursal_id: idSuc,
      user_id: sessionStorage.getItem('user')
    }
    // console.log(data)
    await ipcRenderer.invoke('post-type-product', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          openCloseModal()
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        openCloseModal()
        props.getType()
        e.target.reset()
      })
      .catch(err => Swal.fire('Error', err, 'error'))
  }
  return (
    <>
      <Button variant='contained' endIcon={<SaveIcon />} size='small' onClick={openCloseModal} className={classes.buttonSave}>Crear tipo</Button>
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
            <form onSubmit={postTypeProduct}>
              <div className={classes.inputText}>
                <InputLabel className={classes.inputText} shrink>Tipo de Producto</InputLabel>
                <TextField
                  variant='outlined'
                  size='small'
                  fullWidth
                  inputRef={name_type}
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

export function EditTypeProduct(props) {
  // console.log(props.data)
  const name_type = useRef()
  const { idSuc } = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false)
  const classes = useStyles()

  const openCloseModal = (e) => {
    setOpenModal(!openModal)
  }
  const EditType = async (e) => {
    e.preventDefault()
    const data = {
      type_name: name_type.current.value,
      user_id: sessionStorage.getItem('user'),
      sucursal_id: idSuc,
      type_id: props.data.type_id
    }
    // console.log(data)
    await ipcRenderer.invoke('update-type-product', data)
      .then(resp => {
        var response = JSON.parse(resp)
        if (response === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        props.getType()
        openCloseModal()
      })
      .catch(err => Toast.fire({ icon: 'error', title: err }))
  }
  return (
    <>
      <Button onClick={() => openCloseModal()} color='primary' style={{ textTransform: 'capitalize' }}>Editar</Button>
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
            <form onSubmit={EditType}>
              <div className={classes.inputText}>
                <InputLabel className={classes.inputText} shrink>Tipo de Producto</InputLabel>
                <TextField
                  variant='outlined'
                  size='small'
                  fullWidth
                  inputRef={name_type}
                  defaultValue={props.data.type_name}
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

export function DeleteType(props) {

  const openCloseModalDelete = async (id) => {
    Swal.fire({
      title: 'Estas Seguro de Eliminar?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      text: "El tipo de Producto se eliminará por completo!!",
      icon: 'warning',
    }).then(async resp => {
      if (resp.isConfirmed) {
        // deleteProduct()
        await ipcRenderer.invoke('delete-type-product', id)
          .then(resp => {
            const response = JSON.parse(resp)
            if (response.status === 300) {
              Toast.fire({ icon: 'error', title: response.message })
              return
            }
            Toast.fire({ icon: 'success', title: response.message })
            props.getType()
          })
          .catch(err => Toast.fire({ icon: 'error', title: err }))
      }
    })
  }
  return (
    <>
      <Button onClick={()=>openCloseModalDelete(props.data.type_id)} color='secondary' style={{ textTransform: 'capitalize' }}>Eliminar</Button>
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
