import { Box, Breadcrumbs, Button, CircularProgress, Container, emphasize, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import SearchIcon from '@material-ui/icons/Search';
import PrintIcon from '@material-ui/icons/Print';
import Swal from 'sweetalert2';
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

export default function BalanceDiario() {
    const classes = useStyles()
    const navigate = useNavigate()
    const { id } = useParams()
    const { idSuc,sucName } = useContext(AuthContext)
    const [libro, setLibro] = useState([])
    const [total, setTotal] = useState([])
    const [loading, setLoading] = useState(false)

    const fechaInicio = useRef()
    const fechaFin = useRef()

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

    const getLibroSemana = async (e) => {
        e.preventDefault()
        const data = {
            fechaInicio: fechaInicio.current.value,
            fechaFin: fechaFin.current.value,
            sucursal_id: idSuc
        }
        setLoading(true)
        setLibro([])
        setTotal([])
        await ipcRenderer.invoke(`get-libro-semana`, data)
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
            .finally(() => setLoading(false))
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
        doc.text(`REPORTE SEMANAL DE VENTAS`,pageWidth/2,0.5,'center')
        doc.setFontSize(10)
        doc.text(`Sucursal: ${sucName}`,0.6,0.7)
        doc.text(`Fecha desde: ${fechaInicio.current.value} hasta: ${fechaFin.current.value}`,3.5,0.7)
        doc.autoTable({
            head:[[
                {content:'Fecha'},
                {content:'Descripcion'},
                {content:'Ingresos'},
                {content:'Egresos'},
                {content:'Total'},
            ]],
            body:libro.map((e,index)=>([
                {content:e.register_date},
                {content:e.name_product},
                {content:e.move_id===2||e.move_id===3?e.price_product:''},
                {content:e.move_id===4?e.price_product:''},
                {content:e.total},
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
                <StyledBreadcrumb label="Buscar Semana" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/balance-semana/${id}`)} />
                <StyledBreadcrumb label="Buscar Mes" onClick={() => navigate(`/home/maindrawer/balance-mes/${id}`)} />
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Paper component={Box} p={2}>
                        <Typography variant='subtitle1' align='center' style={{ marginBottom: 20 }}>Busqueda Balance Semana</Typography>
                        <form onSubmit={getLibroSemana}>
                            <TextField
                                label='Fecha Inicio'
                                variant='outlined'
                                fullWidth
                                size='small'
                                required
                                type='date'
                                InputLabelProps={{ shrink: true }}
                                style={{ marginBottom: 15 }}
                                inputRef={fechaInicio}
                            />
                            <TextField
                                label='Fecha Fin'
                                variant='outlined'
                                fullWidth
                                size='small'
                                required
                                type='date'
                                InputLabelProps={{ shrink: true }}
                                style={{ marginBottom: 15 }}
                                inputRef={fechaFin}
                            />
                            <Button type='submit' variant='contained' fullWidth size='small' endIcon={<SearchIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize', marginBottom: 5 }}>Buscar</Button>
                            <Button variant='contained' onClick={pdfGenerate} fullWidth size='small' endIcon={<PrintIcon />} style={{ background: '#1e88e5', color: 'white', textTransform: 'capitalize' }}>Imprimir</Button>

                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TableContainer component={Paper} style={{ maxHeight: '65vh', marginBottom: 10 }}>
                        <Table id='table' stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.colorHead}>Fecha</TableCell>
                                    <TableCell className={classes.colorHead}>Descripcion</TableCell>
                                    <TableCell className={classes.colorHead}>Ingresos</TableCell>
                                    <TableCell className={classes.colorHead}>Egresos</TableCell>
                                    <TableCell className={classes.colorHead}>Saldo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {libro.length > 0 ? (
                                    libro.map((e, index) => (
                                        <TableRow key={index}>
                                            <TableCell size='small'>{e.register_date}</TableCell>
                                            <TableCell size='small'>{e.name_product} - {e.type_product}</TableCell>
                                            <TableCell size='small'> {e.move_id === 2 || e.move_id === 3 ? e.price_product : ''}</TableCell>
                                            <TableCell size='small'>{e.move_id === 4 ? e.price_product : ''}</TableCell>
                                            <TableCell size='small'>{e.total}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell align='center' colSpan={5}>{loading ? <CircularProgress /> : 'No hay Información'}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {total.length > 0 ? (
                        total.map((e, index) => (
                            <Paper key={index} component={Box} p={2}>
                                <Typography align='center' variant='subtitle1'>{e.descripcion}</Typography>
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


