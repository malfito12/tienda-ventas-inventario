import { Box, Button, Container, Dialog, Grid, IconButton, InputLabel, makeStyles, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import { v4 as uuidv4 } from 'uuid';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'

const ipcRenderer = window.require('electron').ipcRenderer


export const VentaProducts = () => {
  const { idSuc } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const classes = useStyles()
  const precioVenta = useRef()
  const client_ci = useRef()
  const [client, setClient] = useState([])
  const [venta, setVenta] = useState(false)
  const [changeData, setChangeData] = useState({
    product_name: '',
    product_amount: '',
    cantidad: '',
    price: ''
  })
  const reChangeData = { product_name: '', product_amount: '', cantidad: '', price: '' }
  useEffect(() => {
    getAllProducts()
  }, [])

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

  //--------------GET PRODUCT------------------
  const getAllProducts = async () => {
    await ipcRenderer.invoke('get-all-products', idSuc)
      .then(resp => setProducts(JSON.parse(resp)))
      .catch(err => console.log(err))
  }

  //--------------AGREGAR PRODUCTO------------------
  const [uno, setUno] = useState([])
  const agregar = (e) => {
    var dos = { ...e, agre_id: uuidv4(), cantidad: 1, type_amount: 'Caja', price: e.product_price }
    setUno([...uno, dos])

  }
  //---------------------------TOTAL CONTADOR---------------------------------------------
  var nose = 0
  for (var i = 0; i < uno.length; i++) {
    nose = nose + parseFloat(uno[i].price)
  }

  //---------------------------BUSCADOR---------------------------------------------
  const [buscador, setBuscador] = useState("")

  const buscarProducto = (buscador) => {
    return function (x) {
      return x.product_name.includes(buscador) ||
        x.product_name.toLowerCase().includes(buscador) ||
        x.product_code.toString().includes(buscador) ||
        !buscador
    }
  }
  //---------------------DELETE DATA---------------------
  const deleteData = (e) => {
    // var newArray = uno.filter((item) => item.product_id !== e.product_id);
    var newArray = uno.filter((item) => item.agre_id !== e.agre_id);
    setUno(newArray)

  }
  //---------------------UPDATE DATA---------------------
  const [openModalData, setOpenModalData] = useState(false)
  const openCloseModalData = (e) => {
    setChangeData(e)
    setOpenModalData(!openModalData)
  }
  const updateData = (e) => {
    var cant = 0
    if (changeData.type_amount === 'Caja') {
      cant = parseFloat(changeData.cantidad) * parseFloat(changeData.product_price)
    } else if (changeData.type_amount === 'Unidad') {
      cant = parseFloat(changeData.cantidad) * parseFloat(changeData.product_price_unit)
    }
    changeData.price = cant.toFixed(2)
    e.preventDefault()
    const indice = uno.findIndex((elemento, indice) => {
      if (elemento.agre_id === changeData.agre_id) {
        return true;
      }
    })
    uno[indice] = changeData;
    openCloseModalData()
    setChangeData(reChangeData)
  }
  //----------------------POST VENTA DE PRODUCTOS------------------------------
  const postVenta = async (e) => {
    e.preventDefault()
    if (uno.length === 0) {
      Toast.fire({ icon: 'error', title: 'Error, No hay productos en el carrito' })
      return
    } else if (precioVenta.current.value === '0') {
      Toast.fire({ icon: 'error', title: 'Error, El Precio de Venta esta en 0, coloque un valor' })
      return
    }
    const data = {
      // client_name: client_name.current.value,
      client_id: client[0].client_id,
      type_amount: changeData.type_amount,
      product_total_price: nose.toFixed(2),
      product_venta_price: precioVenta.current.value,
      sucursal_id: idSuc,
      user_id: sessionStorage.getItem('user'),
    }
    const data2 = {
      data: uno,
      recibo: data
    }
    await ipcRenderer.invoke('post-product-move-venta', data2)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        getAllProducts()
        // setUno([])
        setVenta(true)
        // setClient([])
        // e.target.reset()
      })
      .catch(err => {
        Toast.fire({ icon: 'error', title: err })
      })
    // await ipcRenderer.invoke('post-product-venta',data)
    // .then(resp=>console.log(resp))
    // .catch(err=>console.log(err))
  }
  //---------------------BUSCAR CI---------------------

  const buscarCi = async (e) => {
    e.preventDefault()
    await ipcRenderer.invoke('search-client-ci', client_ci.current.value)
      .then(resp => setClient(JSON.parse(resp)))
      .catch(err => console.log(err))
  }
  //---------------------PDF GENERATE---------------------
  const pdfGenerate = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: [11, 7] })
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth()
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.height()

    var image
    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
    }
    QRCode.toDataURL(
      `Empresa: XXX, Cliente: ${client[0].client_name} ${client[0].client_surname_p} ${client[0].client_surname_m}, CI: ${client[0].client_ci}, Total a Pagar: ${precioVenta.current.value}, cod: ${uuidv4()}`,
      opts,
      // { errorCorrectionLevel: 'H' },
      function (err, url) { image = url })

    var today = new Date();
    doc.setFontSize(12)
    //izquierda
    doc.text(`Presupuesto N°`, 0.5, 0.5)
    doc.setFontSize(10)
    doc.text(`Fecha de Emision: ${today.toLocaleDateString()}`, 0.5, 0.8)
    doc.setFontSize(8)
    doc.text(client.length > 0 ? `Cliente: ${client[0].client_name} ${client[0].client_surname_p} ${client[0].client_surname_m}` : `Cliente`, 0.5, 1.1)
    //derecha
    doc.text(`Nombre de la Empresa`, 3.5, 0.5)
    doc.text(`Documento no valido como factura`, 3.5, 0.8)
    //QR
    doc.addImage(`${image}`, 0.5, 1.3, 1.5, 1.5)
    //Lista
    doc.autoTable({
      head: [[
        { content: 'Producto', styles: { halign: 'center' } },
        { content: 'Tipo', styles: { halign: 'center' } },
        { content: 'Cantidad', styles: { halign: 'center' } },
        { content: 'Precio', styles: { halign: 'center' } },
      ]],
      body: uno.map((e, index) => ([
        { content: e.product_name },
        { content: e.type_amount, styles: { halign: 'center' } },
        { content: e.cantidad, styles: { halign: 'right' } },
        { content: e.price, styles: { halign: 'right' } },
      ])),
      foot: [[
        { content: 'Total a Pagar', colSpan: 3 },
        { content: precioVenta.current.value, styles: { halign: 'right' } }
      ]],
      startY: 1.3,
      tableWidth: 4.3,
      margin: { left: 2.2 }
    })
    doc.setFontSize(8)
    doc.text(`Recibido:`, 2.2, doc.lastAutoTable.finalY + 0.3, 'left')
    doc.text(`Firma:`, 4.2, doc.lastAutoTable.finalY + 0.3, 'left')
    doc.text(`Aclaración:`, 4.2, doc.lastAutoTable.finalY + 0.5, 'left')


    window.open(doc.output('bloburi'))

  }
  //---------------------ACTUALIZAR---------------------
  const actualizar = (e) => {
    setVenta(false)
    setUno([])
    setClient([])
    client_ci.current.value = ''
    precioVenta.current.value=0
  }
  //---------------------HANLDE CHANGE TIPO DE CANTIDAD---------------------
  const handleChange = (e) => {
    setChangeData({
      ...changeData,
      [e.target.name]: e.target.value
    })
  }

  // console.log(client)
  // console.log(client_ci)
  return (
    <>
      <Container maxWidth={false}>
        <Typography variant='h5'>Raelizar Venta</Typography>
        <Grid style={{ marginTop: 20, marginBottom: 40 }} container justifyContent='flex-end' alignItems='center'>
          <Typography variant='subtitle1' style={{marginRight:10}} >Buscar</Typography>
          <TextField
            variant='outlined'
            size='small'
            style={{ width: '30%', background: 'white', borderRadius: 3 }}
            onChange={e => setBuscador(e.target.value)}
          />
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={5}>
            <Paper component={Box} p={1.5}>
              <div align='right'>
                <Button onClick={actualizar} endIcon={<AutorenewIcon />} size='small' style={{ marginLeft: 10, textTransform: 'capitalize', background: '#43a047', color: 'white', }} variant='outlined'></Button>
              </div>
              <form onSubmit={postVenta}>
                <Grid style={{ margin: 10 }} container direction='row' alignItems='center'>
                  <TextField
                    inputRef={client_ci}
                    label='N° Cedula de Indentidad'
                    variant='outlined'
                    size='small'
                    style={{ width: '70%', background: 'white', borderRadius: 3 }}
                    required
                  />
                  <IconButton style={{ marginLeft: 10, background: '#1e88e5', color: 'white' }} onClick={buscarCi}>
                    <SearchIcon />
                  </IconButton>
                </Grid>
                {client.length > 0 ? (
                  <>
                    <Typography align='center' >Datos Principales</Typography>
                    <Typography variant='body1' style={{ marginLeft: 10, marginBottom: 15 }}> Nombre: {client[0].client_name} {client[0].client_surname_p} {client[0].client_surname_m}</Typography>
                  </>
                ) : null}
                {uno.length > 0 ? (
                  uno.map((e, index) => (
                    <Grid key={index} container spacing={1} justifyContent='center' alignItems='center' style={{ padding: 5 }} >
                      <Grid item xs={12} sm={4}>
                        <Typography>{e.product_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{e.type_amount}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{e.cantidad}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography>{e.price} Bs.</Typography>
                      </Grid>
                      <Grid item xs={12} sm={2} align='center'>
                        <IconButton onClick={() => openCloseModalData(e)} size='small' style={{ background: '#fb8c00', color: 'white', marginRight: 10 }}>
                          <EditSharpIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteData(e)} size='small' style={{ background: '#f44336', color: 'white' }}>
                          <DeleteForeverSharpIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
                ) : null}
                <Grid container spacing={3} direction='row' justifyContent='flex-end' alignItems='center'>
                  <InputLabel>Precio Total</InputLabel>
                  <TextField
                    value={`${nose.toFixed(2)} Bs.`}
                    variant='outlined'
                    size='small'
                    style={{ margin: 15 }}
                    required
                  />
                </Grid>
                <Grid container spacing={3} direction='row' justifyContent='flex-end' alignItems='center'>
                  <InputLabel>Precio de Venta</InputLabel>
                  <TextField
                    inputRef={precioVenta}
                    defaultValue={nose}
                    variant='outlined'
                    size='small'
                    style={{ margin: 15 }}
                    required
                  />
                </Grid>
                {venta === false ? (
                  <Button type='submit' variant='contained' fullWidth size='small' endIcon={<SaveIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize', marginTop: 15 }}>Realizar Venta</Button>
                ) : (
                  <Button disabled type='submit' variant='contained' fullWidth size='small' endIcon={<SaveIcon />} style={{ background: '#bdbdbd', color: '#757575', textTransform: 'capitalize', marginTop: 15 }}>Realizar Venta</Button>
                )}
              </form>
              {venta === true ? (
                <Button onClick={pdfGenerate} variant='contained' fullWidth size='small' endIcon={<PrintIcon />} style={{ background: '#1e88e5', color: 'white', textTransform: 'capitalize', marginTop: 10 }}>Imprimir Recibo</Button>
              ) : (
                <Button disabled onClick={pdfGenerate} variant='contained' fullWidth size='small' endIcon={<PrintIcon />} style={{ background: '#bdbdbd', color: '#757575', textTransform: 'capitalize', marginTop: 10 }}>Imprimir Recibo</Button>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={7}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>N°</TableCell>
                    <TableCell>Imagen</TableCell>
                    <TableCell>Codigo</TableCell>
                    <TableCell>Descripcion</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.filter(buscarProducto(buscador)).map((e, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell size='small'><img src={e.product_image} style={{ width: '50px', height: '50px' }} alt='#' /></TableCell>
                        <TableCell>{e.product_code}</TableCell>
                        <TableCell>{e.product_name}</TableCell>
                        <TableCell width={20}><Paper style={
                          e.stock >= 50
                            ? { background: '#43a047', color: 'white', padding: 5 }
                            : e.stock >= 25 && e.stock <= 49
                              ? { background: '#ffeb3b', color: '#616161', padding: 5 }
                              : e.stock >= 1 && e.stock <= 24
                                ? { background: '#f44336', color: 'white', padding: 5 }
                                : null
                        }>{e.stock}</Paper></TableCell>
                        <TableCell>
                          <Button onClick={() => agregar(e)} size='small' endIcon={<LocalGroceryStoreIcon />} variant='outlined' style={{ background: '#2196f3', color: 'white', textTransform: 'capitalize' }}>Agregar</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
      {/* -----------------------modal data------------------------------------ */}
      <Dialog
        open={openModalData}
        onClose={openCloseModalData}
        maxWidth='xs'
      >
        <Paper component={Box} p={2}>
          <Typography align='center' variant='h5'>Modificar</Typography>
          {/* <form onSubmit={updateData}> */}
          <label >Nombre de Producto</label>
          <TextField
            name='product_name'
            variant='outlined'
            size='small'
            fullWidth
            onChange={handleChange}
            defaultValue={changeData.product_name}
            className={classes.alignText} />
          <label>Tipo de Cantidad</label>
          <TextField
            name='type_amount'
            variant='outlined'
            size='small'
            fullWidth
            className={classes.alignText}
            onChange={handleChange}
            select
            defaultValue={changeData.type_amount}
          >
            <MenuItem value='Caja'>Por Caja</MenuItem>
            <MenuItem value='Unidad'>Por Unidad</MenuItem>
          </TextField>
          <label>Cantidad</label>
          <TextField
            name='cantidad'
            variant='outlined'
            size='small'
            fullWidth
            onChange={handleChange}
            defaultValue={changeData.cantidad}
            inputProps={{ step: 'any' }}
            type='number'
            className={classes.alignText} />
          <Button onClick={updateData} variant='contained' style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }} fullWidth>Aceptar</Button>
          {/* </form> */}
        </Paper>
      </Dialog>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  alignText: {
    margintop: 10,
    marginBottom: 10
  }
}))