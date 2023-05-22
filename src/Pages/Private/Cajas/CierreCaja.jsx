import { Box, Breadcrumbs, Button, Chip, CircularProgress, Container, Dialog, emphasize, Grid, makeStyles, MenuItem, Paper, TableContainer, TextField, Typography, withStyles } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import SaveIcon from '@material-ui/icons/Save';
import Swal from 'sweetalert2';


const ipcRenderer = window.require('electron').ipcRenderer

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);

const CierreCaja = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { id } = useParams()
  const { idSuc } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const anio = useRef()
  const mes = useRef()
  const ingreso = useRef(0)
  const egreso = useRef(0)
  const total = useRef(0)

  useEffect(() => {
    getAllProducts()
  }, [])

  const getAllProducts = async () => {
    await ipcRenderer.invoke('get-all-products-caja', idSuc)
      .then(resp => {
        var response = JSON.parse(resp)
        // response.sort((a, b) => new Date(a.to_char) - new Date(b.to_char))
        setProducts(response)
      })
      .catch(err => console.log(err))
  }
  // console.log(products)

  const columns = [
    { title: 'Fecha', field: 'to_char' },
    { title: 'Name', field: 'product_name' },
    { title: 'Tipo Producto', field: 'type_name' },
    { title: 'Tipo MV', field: 'move_id', render: (row) => row.move_id === 1 ? <div style={{ color: 'red' }}>Egreso</div> : <div style={{ color: '#43a047' }}>Ingreso</div> },
    { title: 'Cantidad', field: 'product_move_amount' },
    { title: 'Monto Bs.', field: 'product_move_price', render: (row) => <div>{row.product_move_price} Bs.</div> },
  ]

  const meses = [
    { id: 1, name: 'ENERO' },
    { id: 2, name: 'FEBRERO' },
    { id: 3, name: 'MARZO' },
    { id: 4, name: 'ABRIL' },
    { id: 5, name: 'MAYO' },
    { id: 6, name: 'JUNIO' },
    { id: 7, name: 'JULIO' },
    { id: 8, name: 'AGOSTO' },
    { id: 9, name: 'SEPTIEMBRE' },
    { id: 10, name: 'OCTUBRE' },
    { id: 11, name: 'NOVIEMBRE' },
    { id: 12, name: 'DICIEMBRE' },
  ]
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
  //----------------POST BALANCE MENSUAL-----------------------
  const openModalBalance = (e) => {
    console.log(e)
    setData(e)
    ingreso.current = 0
    egreso.current = 0
    total.current = 0
    for (var i = 0; i < e.length; i++) {
      if (e[i].move_id === 2) {
        ingreso.current = (parseFloat(ingreso.current) + parseFloat(e[i].product_move_price)).toFixed(2)
      } else {
        egreso.current = (parseFloat(egreso.current) + parseFloat(e[i].product_move_price)).toFixed(2)
      }
    }
    total.current = (ingreso.current - egreso.current).toFixed(2)
    setOpenModal(true)
  }
  const closeModalBalance = () => {
    setOpenModal(false)
  }
  const postBalanceMensual = async (e) => {
    e.preventDefault()
    const dataMes = {
      ingreso: ingreso.current,
      egreso: egreso.current,
      total: total.current,
      anio: anio.current.value,
      mes: mes.current.value,
      sucursal_id: idSuc,
    }
    const data2Mes = {
      libro_mes: data,
      total_mes: dataMes
    }
    // console.log(data2Mes)
    setLoading(true)
    await ipcRenderer.invoke('post-balance-mes', data2Mes)
      .then(resp => {
        var response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        getAllProducts()
        closeModalBalance()
      })
      .catch(err => Toast.fire({ icon: 'error', title: err }))
      .finally(() => setLoading(false))

  }
  // console.log(products)
  return (
    <>
      <Container>
        <Breadcrumbs className={classes.spacingBread}>
          <StyledBreadcrumb label="Movimiento Semana" onClick={() => navigate(`/home/maindrawer/libro-diario/${id}`)} />
          <StyledBreadcrumb label="Movimiento Mes" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/cierre-caja/${id}`)} />
          <StyledBreadcrumb label="Busqueda Semana" onClick={() => navigate(`/home/maindrawer/balance-semana/${id}`)} />
          <StyledBreadcrumb label="Busqueda Mes" onClick={() => navigate(`/home/maindrawer/balance-mes/${id}`)} />
        </Breadcrumbs>
        <MaterialTable
          title='Reporte de Movimientos'
          data={products}
          columns={columns}
          options={{
            selection: true,
            headerStyle: {
              backgroundColor: '#01579b',
              color: '#FFF'
            },
            rowStyle: { fontSize: 11.5 },
            pageSizeOptions: [10, 30, 60, 100],
            paging: true,
            pageSize: 10,
            emptyRowsWhenPaging: false,
          }}

          actions={[
            {
              tooltip: 'Guardar Datos',
              icon: 'save',
              onClick: (evt, data) => openModalBalance(data),
            }
          ]}
        />
      </Container>
      <Dialog
        open={openModal}
        onClose={closeModalBalance}
        maxWidth='xs'
      >
        <Paper component={Box} p={2}>
          <Typography variant='h6' align='center'>Guardar Balance Mensual</Typography>
          <form onSubmit={postBalanceMensual}>
            <div style={{ margin: 20 }}>
              <Typography variant='h6'>Ingreso: {ingreso.current} Bs.</Typography>
              <Typography variant='h6'>Egreso: {egreso.current} Bs.</Typography>
              <Typography variant='h6'>Total: {total.current} Bs.</Typography>
            </div>
            <TextField
              label='Año de Registro'
              variant='outlined'
              size='small'
              fullWidth
              type='number'
              style={{ padding: 2, marginBottom: 10 }}
              inputRef={anio}
              required
            />
            <TextField
              label='Mes de Registro'
              variant='outlined'
              size='small'
              fullWidth
              defaultValue=''
              style={{ padding: 2, marginBottom: 10 }}
              inputRef={mes}
              required
              select
            >
              {meses && meses.map(e => (
                <MenuItem key={e.id} value={e.name}>{e.name}</MenuItem>
              ))}
            </TextField>
            <Button disabled={loading} type='submit' variant='contained' fullWidth size='small' endIcon={<SaveIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize', marginTop: 15 }}>{loading ? <CircularProgress style={{ width: 25, height: 25 }} /> : 'Guardar'}</Button>
          </form>
        </Paper>
      </Dialog>
    </>
  )
}

export default CierreCaja

const useStyles = makeStyles((theme) => ({
  spacingBread: {
    // marginTop: 20,
    marginBottom: 10,
  },
  buttonSave: {
    background: '#43a047',
    color: 'white',
    marginBottom: 20,
  }
}))