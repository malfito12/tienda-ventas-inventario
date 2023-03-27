import { Box, Button, Dialog, Grid, IconButton, InputLabel, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useContext, useRef, useState } from 'react'
import CancelPresentationTwoToneIcon from '@material-ui/icons/CancelPresentationTwoTone';
import SaveIcon from '@material-ui/icons/Save';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Atoms/AuthContext';
const ipcRenderer = window.require('electron').ipcRenderer



export default function AddTypeProduct(props) {
  const {user}=useContext(AuthContext)
  const name_type=useRef()
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
      // user_id: user
      user_id: sessionStorage.getItem('user')
    }
    // console.log(data)
    await ipcRenderer.invoke('post-type-product', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Swal.fire('Error', response.message, 'error')
          openCloseModal()
          return
        }
        Swal.fire('Success', response.message, 'success')
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
