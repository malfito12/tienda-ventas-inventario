import { Box, Breadcrumbs, Button, Container, emphasize, Grid, makeStyles, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useRef, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Components/Atoms/AuthContext';


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

export default function BalanceMensual() {
  const classes = useStyles()
  const navigate = useNavigate()
  const { id } = useParams()
  const { idSuc } = useContext(AuthContext)
  const [libro, setLibro] = useState([])
  const [total, setTotal] = useState([])
  const mes = useRef()
  const anio = useRef()

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

  const getLibroMes = async (e) => {
    e.preventDefault()
    const data = {
      mes: mes.current.value,
      anio: anio.current.value,
      sucursal_id: idSuc
    }
    await ipcRenderer.invoke('get-libro-mes', data)
      .then(resp => {
        var response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        setLibro(response.dataLibro)
        setTotal(response.dataTotal)
        Toast.fire({ icon: 'success', title: response.message })
      })
      .catch(err => Toast.fire({ icon: 'error', title: err }))
  }
  // console.log(libro)
  // console.log(total)
  return (
    <Container>
      <Breadcrumbs className={classes.spacingBread}>
        <StyledBreadcrumb label="Movimiento Semana" onClick={() => navigate(`/maindrawer/libro-diario/${id}`)} />
        <StyledBreadcrumb label="Movimiento Mes" onClick={() => navigate(`/maindrawer/cierre-caja/${id}`)} />
        <StyledBreadcrumb label="Busqueda Semana" onClick={() => navigate(`/maindrawer/balance-semana/${id}`)} />
        <StyledBreadcrumb label="Busqueda Mes" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/balance-mes/${id}`)} />
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper component={Box} p={2}>
            <Typography variant='subtitle1' align='center' style={{ marginBottom: 20 }}>Busqueda Balance Semana</Typography>
            <form onSubmit={getLibroMes}>
              <TextField
                label='Mes de Registro'
                variant='outlined'
                fullWidth
                size='small'
                required
                InputLabelProps={{ shrink: true }}
                style={{ marginBottom: 15 }}
                inputRef={mes}
                defaultValue=''
                select
              >
                {meses && meses.map(e => (
                  <MenuItem key={e.id} value={e.name}>{e.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label='Año de Registro'
                variant='outlined'
                fullWidth
                size='small'
                type='number'
                required
                style={{ marginBottom: 15 }}
                inputRef={anio}
              />
              <Button type='submit' variant='contained' fullWidth size='small' endIcon={<SearchIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }}>Buscar</Button>

            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TableContainer component={Paper} style={{ marginBottom: 15 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripcion</TableCell>
                  <TableCell>Tipo MV</TableCell>
                  <TableCell>Saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {libro.length > 0 ? (
                  libro.map((e, index) => (
                    <TableRow key={index}>
                      <TableCell>{e.register_date}</TableCell>
                      <TableCell>{e.product_name} {e.type_product === 'Registro de Semana' ? '' : ` - ${e.type_product}`}</TableCell>
                      {e.type_move === 1 ? <TableCell style={{ color: 'red' }}>Egreso</TableCell> : <TableCell style={{ color: '#43a047' }}>Ingreso</TableCell>}
                      <TableCell>{e.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={4}>No hay Información</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {total.length > 0 ? (
            total.map((e, index) => (
              <Paper key={index} component={Box} p={2}>
                <Typography align='center' variant='subtitle1'>Total Mes de {e.mes} del {e.anio}</Typography>
                <Grid container direction='row' justifyContent='space-around' alignItems='center'>
                  <Typography variant='subtitle2'>Ingreso: {e.ingreso} Bs.</Typography>
                  <Typography variant='subtitle2'>Egreso: {e.egreso} Bs.</Typography>
                  <Typography variant='subtitle2'>Total: {e.total} Bs.</Typography>
                </Grid>
              </Paper>
            ))
          ) : null}
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  spacingBread: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonSave: {
    background: '#43a047',
    color: 'white',
    marginBottom: 20,
  }
}))


