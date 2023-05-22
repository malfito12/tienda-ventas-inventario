import { Box, Breadcrumbs, Button, CircularProgress, Container, emphasize, Grid, makeStyles, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useRef, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import PrintIcon from '@material-ui/icons/Print';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import jsPDF from 'jspdf'
import 'jspdf-autotable'


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
  const { idSuc,sucName } = useContext(AuthContext)
  const [libro, setLibro] = useState([])
  const [total, setTotal] = useState([])
  const [loading,setLoading]=useState(false)
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
    setLoading(true)
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
      .finally(()=>setLoading(false))
  }
  //----------------------IMPRIMIR--------------------
  const pdfGenerate = () => {
    if(libro.length===0 && total.length===0){
        return Toast.fire({ icon: 'warning', title: 'No se puede imprimir informacion vacia' })

    }
    const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: [11, 7] })
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth()
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.height()

    doc.setFontSize(11)
    doc.text(`REPORTE MES DE VENTAS`,pageWidth/2,0.5,'center')
    doc.setFontSize(10)
    doc.text(`Sucursal: ${sucName}`,0.6,0.7)
    doc.text(`Mes: ${mes.current.value} del año: ${anio.current.value}`,3.5,0.7)
    doc.autoTable({
        head:[[
            {content:'Fecha',styles:{halign: 'center'}},
            {content:'Descripcion',styles:{halign: 'center'}},
            {content:'Tipo Movimiento',styles:{halign: 'center'}},
            {content:'Total Saldo',styles:{halign: 'center'}},
        ]],
        body:libro.map((e,index)=>([
            {content:e.register_date},
            {content:e.product_name},
            {content:e.type_move===1?'Egreso':'Ingreso',styles:{halign: 'center'}},
            {content:`${e.total}Bs.`,styles:{halign: 'right'}},
        ])),
        startY:0.8
    })
    doc.setFontSize(10)
    doc.text('Total Semana',pageWidth/2,doc.lastAutoTable.finalY+0.3,'center')
    doc.text(`Ingreso:${total[0].ingreso}Bs.     Egreso:${total[0].egreso}Bs.     Total:${total[0].total}Bs.`,pageWidth/2,doc.lastAutoTable.finalY+0.5,'center')

    window.open(doc.output('bloburi'))

}
  // console.log(libro)
  // console.log(total)
  return (
    <Container>
      <Breadcrumbs className={classes.spacingBread}>
        <StyledBreadcrumb label="Movimiento Semana" onClick={() => navigate(`/home/maindrawer/libro-diario/${id}`)} />
        <StyledBreadcrumb label="Movimiento Mes" onClick={() => navigate(`/home/maindrawer/cierre-caja/${id}`)} />
        <StyledBreadcrumb label="Busqueda Semana" onClick={() => navigate(`/home/maindrawer/balance-semana/${id}`)} />
        <StyledBreadcrumb label="Busqueda Mes" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/balance-mes/${id}`)} />
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper component={Box} p={2}>
            <Typography variant='subtitle1' align='center' style={{ marginBottom: 20 }}>Busqueda Balance Mes</Typography>
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
                label='Año: Ejm 2010'
                variant='outlined'
                fullWidth
                size='small'
                type='number'
                required
                style={{ marginBottom: 15 }}
                inputRef={anio}
              />
              <Button type='submit' variant='contained' fullWidth size='small' endIcon={<SearchIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize',marginBottom:5 }}>Buscar</Button>
              <Button variant='contained' onClick={pdfGenerate} fullWidth size='small' endIcon={<PrintIcon />} style={{ background: '#1e88e5', color: 'white', textTransform: 'capitalize' }}>Imprimir</Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TableContainer component={Paper} style={{ marginBottom: 15,maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.colorHead}>Fecha</TableCell>
                  <TableCell className={classes.colorHead}>Descripcion</TableCell>
                  <TableCell className={classes.colorHead}>Tipo MV</TableCell>
                  <TableCell className={classes.colorHead}>Saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {libro.length > 0 ? (
                  libro.map((e, index) => (
                    <TableRow key={index}>
                      <TableCell size='small'>{e.register_date}</TableCell>
                      <TableCell size='small'>{e.product_name} {e.type_product === 'Registro de Semana' ? '' : ` - ${e.type_product}`}</TableCell>
                      {e.type_move === 1 ? <TableCell size='small' style={{ color: 'red' }}>Egreso</TableCell> : <TableCell size='small' style={{ color: '#43a047' }}>Ingreso</TableCell>}
                      <TableCell size='small'>{e.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={4}>{loading?<CircularProgress/>:'No hay Información'}</TableCell>
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
    // marginTop: 20,
    marginBottom: 10,
  },
  buttonSave: {
    background: '#43a047',
    color: 'white',
    marginBottom: 20,
  },
  colorHead: {
    background: '#424242',
    color: 'white',
    padding: 13
}
}))


