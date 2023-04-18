import { Box, Breadcrumbs, Button, Container, emphasize, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import SearchIcon from '@material-ui/icons/Search';
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

export default function BalanceDiario() {
    const classes = useStyles()
    const navigate = useNavigate()
    const { id } = useParams()
    const { idSuc } = useContext(AuthContext)
    const [libro, setLibro] = useState([])
    const [total, setTotal] = useState([])

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
    }
    // console.log(libro)
    // console.log(total)
    return (
        <Container>
            <Breadcrumbs className={classes.spacingBread}>
                <StyledBreadcrumb label="Movimiento Semana" onClick={() => navigate(`/maindrawer/libro-diario/${id}`)} />
                <StyledBreadcrumb label="Movimiento Mes" onClick={() => navigate(`/maindrawer/cierre-caja/${id}`)} />
                <StyledBreadcrumb label="Busqueda Semana" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/balance-semana/${id}`)} />
                <StyledBreadcrumb label="Busqueda Mes" onClick={() => navigate(`/maindrawer/balance-mes/${id}`)} />
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Paper component={Box} p={2}>
                        <Typography variant='subtitle1' align='center' style={{ marginBottom: 20 }}>Busqueda Balance Semana</Typography>
                        <form onSubmit={getLibroSemana}>
                            <TextField
                                label='Fecha de Inicio'
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
                                label='Fecha de Inicio'
                                variant='outlined'
                                fullWidth
                                size='small'
                                required
                                type='date'
                                InputLabelProps={{ shrink: true }}
                                style={{ marginBottom: 15 }}
                                inputRef={fechaFin}
                            />
                            <Button type='submit' variant='contained' fullWidth size='small' endIcon={<SearchIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }}>Buscar</Button>

                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TableContainer component={Paper} style={{ marginBottom: 20 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Descripcion</TableCell>
                                    <TableCell>Ingresos</TableCell>
                                    <TableCell>Egresos</TableCell>
                                    <TableCell>Saldo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {libro.length > 0 ? (
                                    libro.map((e, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{e.register_date}</TableCell>
                                            <TableCell>{e.name_product} - {e.type_product}</TableCell>
                                            <TableCell> {e.move_id === 2 || e.move_id === 3 ? e.price_product : ''}</TableCell>
                                            <TableCell>{e.move_id === 4 ? e.price_product : ''}</TableCell>
                                            <TableCell>{e.total}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell align='center' colSpan={5}>No hay Información</TableCell>
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
        marginTop: 20,
        marginBottom: 20,
    },
    buttonSave: {
        background: '#43a047',
        color: 'white',
        marginBottom: 20,
    }
}))


