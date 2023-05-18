import { Box, Button, CircularProgress, Dialog, Grid, IconButton, InputLabel, makeStyles, MenuItem, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import CancelPresentationTwoToneIcon from '@material-ui/icons/CancelPresentationTwoTone';
import Swal from 'sweetalert2';
import EditSharpIcon from '@material-ui/icons/EditSharp';
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

export function AddProduct(props) {
  const { idSuc, user } = useContext(AuthContext)
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [loading,setLoading]=useState(false)
  const [preview, setPreview] = useState(null)
  const [unidadMedida, setUnidadMedida] = useState([])
  const [type, setType] = useState([])
  const [typeSpecific, setTypeSpecific] = useState([])
  const name_product = useRef()
  const type_product = useRef()
  const unidad_product = useRef()
  const price_product = useRef()
  const price_unit_product = useRef()
  const amount_box_product = useRef()
  const code_product = useRef()

  useEffect(() => {
    getUnidadMedida()
    getType()
  }, [])
  const openCloseModal = () => {
    setOpenModal(!openModal)
    setTypeSpecific([])
    setPreview(null)
  }
  const getUnidadMedida = async () => {
    await ipcRenderer.invoke('get-all-unidad-medida',idSuc)
      .then(resp => setUnidadMedida(JSON.parse(resp)))
      .catch(err => console.log(err))
  }
  const getType = async () => {
    await ipcRenderer.invoke('get-all-type-product',idSuc)
      .then(resp => setType(JSON.parse(resp)))
      .catch(err => console.log(err))
  }

  // ------------------------POST PRODUCT--------------------
  const postProduct = async (e) => {
    e.preventDefault()
    
    const data = {
      product_name: name_product.current.value,
      product_price: price_product.current.value,
      product_price_unit: price_unit_product.current.value,
      product_amount_box: amount_box_product.current.value,
      u_medida_id: unidad_product.current.value,
      type_id: type_product.current.value,
      product_code: code_product.current.value,
      product_image: preview,
      sucursal_id: idSuc,
      // user_id: user
      user_id: sessionStorage.getItem('user')
    }
    setLoading(true)
    await ipcRenderer.invoke('post-product', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }

        Toast.fire({ icon: 'success', title: response.message })
        openCloseModal()
        setTypeSpecific([])
        props.getProducts()
        e.target.reset()
      })
      .catch(err => Swal.fire('Error', err, 'error'))
      .finally(()=>setLoading(false))
  }

  //----------HANDLEcHANGE image------------------
  const [changeDataImage, setChangeDataImage] = useState({ image_product: '' })
  const handleChangeImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.includes('image')) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          setPreview(reader.result)

        }
      }
    }
    setChangeDataImage({
      ...changeDataImage,
      [e.target.name]: e.target.value
    })
  }
  const handleType=async(e)=>{
    var id=e.target.value
    await ipcRenderer.invoke('get-specific-product',id)
    .then(resp=>setTypeSpecific(JSON.parse(resp)))
    .catch(err=>console.log(err))
  }
  return (
    <>
      <Button variant='contained' endIcon={<SaveIcon />} size='small' onClick={openCloseModal} className={classes.buttonSave} style={{margin:5, textTransform: 'capitalize'}}>Nuevo Producto</Button>
      <Dialog
        open={openModal}
        onClose={openCloseModal}
        maxWidth='sm'
      >
        <Paper component={Box} p={2}>
          <div align='right'>
            <IconButton size='small' onClick={openCloseModal}>
              <CancelPresentationTwoToneIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </div>
          <Typography align='center'>Registro de Producto</Typography>
          <form onSubmit={postProduct}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <div className={classes.inputText}>
                  <label>Nombre de Producto</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={name_product}
                    required
                  />
                </div>
                <div className={classes.inputText}>
                  <label>Tipo de Producto</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                    inputRef={type_product}
                    required
                    defaultValue=""
                    onChange={handleType}
                  >
                    {type.length > 0 ? (type.map((e, index) => (
                      <MenuItem key={index} value={e.type_id}>{e.type_name}</MenuItem>
                    ))) : null}
                  </TextField>
                </div>
                <div className={classes.inputText}>
                  <label >Unidad de Medida</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                    inputRef={unidad_product}
                    required
                    defaultValue=""
                  >
                    {unidadMedida.length > 0 ? (unidadMedida.map((e, index) => (
                      <MenuItem key={index} value={e.u_medida_id}>{e.u_medida_name}</MenuItem>
                    ))) : null}
                  </TextField>
                </div>
                <div className={classes.inputText}>
                  <label >Precio por Caja</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={price_product}
                    inputProps={{ step: 'any' }}
                    type='number'
                    required
                  />
                </div>
                <div className={classes.inputText}>
                  <label >Precio por Unidad</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={price_unit_product}
                    inputProps={{ step: 'any' }}
                    type='number'
                    required
                  />
                </div>
                <div className={classes.inputText}>
                  <label >Numero de Unidades por Caja</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={amount_box_product}
                    inputProps={{ step: 'any' }}
                    type='number'
                    required
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.inputText}>
                  <label >Codigo de Producto</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={code_product}
                    required
                    placeholder={typeSpecific.length===0?`Ejm X-100`:`Ultimo Codigo ${typeSpecific[0].product_code}`}
                  />
                </div>
                <div style={{ marginTop: 30 }} align='center'>
                  <Paper component={Box} p={1} style={{ background: '#bdbdbd', width: '250px', height: '250px' }}>
                    <img src={preview} style={{ width: '100%', height: '100%' }} alt='#' />
                  </Paper>
                  <input
                    name='image_product'
                    // inputRef={image_product}
                    type='file'
                    accept='image/*'
                    id='file-image'
                    style={{ display: 'none' }}
                    onChange={handleChangeImage}
                  // required

                  />
                  <label htmlFor='file-image'>
                    <Button size='small' style={{ marginTop: '1rem', width: '77%',textTransform:'capitalize' }} variant='contained' color='primary' component='span' fullWidth>cargar</Button>
                  </label>
                </div>

              </Grid>
            </Grid>
            <div style={{ marginTop: 20 }}>
              <Button disabled={loading} type='submit' variant='contained' style={{ background: '#43a047', color: 'white', textTransform:'capitalize' }} fullWidth>{loading?<CircularProgress style={{width:25,height:25}}/>:'Guardar'}</Button>
            </div>
          </form>
        </Paper>
      </Dialog>
    </>
  )
}


export function UpdateProduct(props) {
  // console.log(props.data)
  const {idSuc}=useContext(AuthContext)
  const classes = useStyles()
  const [preview, setPreview] = useState(props.data.product_image)
  const [unidadMedida, setUnidadMedida] = useState([])
  const [type, setType] = useState([])
  const [loading,setLoading]=useState(false)
  const name_product = useRef()
  const type_product = useRef()
  const unidad_product = useRef()
  const price_product = useRef()
  const price_unit_product = useRef()
  const amount_box_product = useRef()
  const code_product = useRef()
  useEffect(() => {
    getUnidadMedida()
    getType()
  }, [])

  const getUnidadMedida = async () => {
    await ipcRenderer.invoke('get-all-unidad-medida',idSuc)
      .then(resp => setUnidadMedida(JSON.parse(resp)))
      .catch(err => console.log(err))
  }
  const getType = async () => {
    await ipcRenderer.invoke('get-all-type-product',idSuc)
      .then(resp => setType(JSON.parse(resp)))
      .catch(err => console.log(err))
  }
  
  //-------EDIT PRODUCT---------------------
  const [openEditModal, setOpenEditModal] = useState(false)
  const openCloseEditModal = () => {
    setOpenEditModal(!openEditModal)
  }
  const editProduct = async (e) => {
    e.preventDefault()
    const data = {
      product_name: name_product.current.value,
      product_price: price_product.current.value,
      product_price_unit: price_unit_product.current.value,
      product_amount_box: amount_box_product.current.value,
      u_medida_id: unidad_product.current.value,
      type_id: type_product.current.value,
      product_code: code_product.current.value,
      product_image: preview,
      product_id: props.data.product_id
    }
    // console.log(data)
    setLoading(true)
    await ipcRenderer.invoke('update-product', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        openCloseEditModal()
        props.getProducts()
      })
      .catch(err => Toast.fire({ icon: 'error', title: err }))
      .finally(()=>setLoading(false))
  }
  //----------HANDLEcHANGE image------------------
  const [changeDataImage, setChangeDataImage] = useState({ image_product: '' })
  const handleChangeImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.includes('image')) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          setPreview(reader.result)

        }
      }
    }
    setChangeDataImage({
      ...changeDataImage,
      [e.target.name]: e.target.value
    })
  }
  return (
    <>
      <Tooltip title='Editar'>
        <IconButton onClick={openCloseEditModal} size='small' style={{ background: '#fb8c00', color: 'white', marginRight: 5 }}>
          <EditSharpIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={openEditModal}
        onClose={openCloseEditModal}
        maxWidth='sm'
      >
        <Paper component={Box} p={2}>
          <div align='right'>
            <IconButton size='small' onClick={openCloseEditModal}>
              <CancelPresentationTwoToneIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </div>
          <Typography align='center'>Actualizar Producto</Typography>
          <form onSubmit={editProduct}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <div className={classes.inputText}>
                  <label>Nombre de Producto</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={name_product}
                    required
                    defaultValue={props.data.product_name}
                  />
                </div>
                <div className={classes.inputText}>
                  <label>Tipo de Producto</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                    inputRef={type_product}
                    required
                    defaultValue={props.data.type_id}
                  >
                    {type.length > 0 ? (type.map((e, index) => (
                      <MenuItem key={index} value={e.type_id}>{e.type_name}</MenuItem>
                    ))) : null}
                  </TextField>
                </div>
                <div className={classes.inputText}>
                  <label >Unidad de Medida</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                    inputRef={unidad_product}
                    required
                    defaultValue={props.data.u_medida_id}
                  >
                    {unidadMedida.length > 0 ? (unidadMedida.map((e, index) => (
                      <MenuItem key={index} value={e.u_medida_id}>{e.u_medida_name}</MenuItem>
                    ))) : null}
                  </TextField>
                </div>
                <div className={classes.inputText}>
                  <label >Precio por Caja</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={price_product}
                    inputProps={{ step: 'any' }}
                    type='number'
                    required
                    defaultValue={props.data.product_price}
                  />
                </div>
                <div className={classes.inputText}>
                  <label >Precio por Unidad</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={price_unit_product}
                    inputProps={{ step: 'any' }}
                    type='number'
                    required
                    defaultValue={props.data.product_price_unit}
                  />
                </div>
                <div className={classes.inputText}>
                  <label >Numero de Unidades por Caja</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={amount_box_product}
                    inputProps={{ step: 'any' }}
                    type='number'
                    required
                    defaultValue={props.data.product_amount_box}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.inputText}>
                  <label >Codigo de Producto</label>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    inputRef={code_product}
                    required
                    defaultValue={props.data.product_code}
                  />
                </div>
                <div style={{ marginTop: 30 }} align='center'>
                  <Paper component={Box} p={1} style={{ background: '#bdbdbd', width: '250px', height: '250px' }}>
                    <img src={preview} style={{ width: '100%', height: '100%' }} alt='#' />
                  </Paper>
                  <input
                    name='image_product'
                    // inputRef={image_product}
                    type='file'
                    accept='image/*'
                    id='file-image'
                    style={{ display: 'none' }}
                    onChange={handleChangeImage}
                  // required

                  />
                  <label htmlFor='file-image'>
                    <Button size='small' style={{ marginTop: '1rem', width: '77%',textTransform:'capitalize' }} variant='contained' color='primary' component='span' fullWidth>cargar</Button>
                  </label>
                </div>

              </Grid>
            </Grid>
            <div style={{ marginTop: 20 }}>
              <Button disabled={loading} type='submit' variant='contained' style={{ background: '#43a047', color: 'white',textTransform:'capitalize' }} fullWidth>{loading?<CircularProgress style={{width:20,height:20}}/>:'Guardar'}</Button>
            </div>
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
  inputText: {
    marginTop: 10,
    marginBottom: 10
  },
}))