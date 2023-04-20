import { Box, Breadcrumbs, Button, Container, Dialog, emphasize, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import MaterialTable from 'material-table';
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

export default function LibroDiario() {
    const classes = useStyles()
    const navigate = useNavigate()
    const { id } = useParams()
    const { idSuc } = useContext(AuthContext)
    const [libro, setLibro] = useState([])
    const [dataSemana,setDataSemana]=useState([])
    const [openModal, setOpenModal] = useState(false)

    const fechaInicio = useRef()
    const fechaFin = useRef()
    const ingreso = useRef(0)
    const egreso = useRef(0)
    const total = useRef(0)
    useEffect(() => {
        getMoveSemana()
    }, [])

    const columns = [
        { title: 'Fecha', field: 'to_char' },
        { title: 'Name', field: 'product_name' },
        { title: 'Tipo Producto', field: 'type_name' },
        { title: 'Ingresos', field: 'move_id', render: (row) => <div>{row.move_id === 2 || row.move_id === 3 ? `${row.product_move_price } Bs.`: ''}</div> },
        { title: 'Egresos', field: 'move_id', render: (row) => <div>{row.move_id === 4 ? `${row.product_move_price} Bs.` : ''}</div> },
        { title: 'Cantidad', field: 'product_move_amount' },
        { title: 'Total', field: 'total', render:(row)=><div>{row.total} Bs.</div> },
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
    const getMoveSemana = async () => {
        await ipcRenderer.invoke('get-all-move-semana', idSuc)
            .then(resp => {
                var response = JSON.parse(resp)
                // response.sort((a, b) => new Date(a.to_char) - new Date(b.to_char))
                setLibro(response)
            })
            .catch(err => console.log(err))
    }

    //------------GUARDAR LIBRO SEMANA-------------------
    const openModalSemana = (e) => {
        // setData(e)
        // console.log(e)
        setDataSemana(e)
        ingreso.current = 0
        egreso.current = 0
        total.current = 0
        for (var i = 0; i < e.length; i++) {
            if (e[i].move_id === 2 || e[i].move_id === 3) {
                ingreso.current = (parseFloat(ingreso.current) + parseFloat(e[i].product_move_price)).toFixed(2)
            } else {
                egreso.current = (parseFloat(egreso.current) + parseFloat(e[i].product_move_price)).toFixed(2)
            }
        }
        total.current = (ingreso.current - egreso.current).toFixed(2)
        setOpenModal(true)
    }
    const closeModalSemana=()=>{
        setOpenModal(false)
    }
    const postLibroSemana = async (e) => {
        e.preventDefault()
        const data={
            ingreso:ingreso.current,
            egreso:egreso.current,
            total:total.current,
            fechaInicio:fechaInicio.current.value,
            fechaFin:fechaFin.current.value,
            sucursal_id:idSuc,
        }
        const data2={
            libro_semana:dataSemana,
            total_semana:data
        }
        await ipcRenderer.invoke('post-libro-semana',data2)
        .then(resp=>{
            var response=JSON.parse(resp)
            // console.log(response)
            if(response.status===300){
                Toast.fire({ icon: 'error', title: response.message })
                return
            }
            Toast.fire({ icon: 'success', title: response.message })
            getMoveSemana()
            closeModalSemana()
        })
        // .catch(err=>Toast.fire({ icon: 'error', title: err }))
        // console.log(data2)
    }
    // console.log(libro)
    return (
        <>
            <Container>
                <Breadcrumbs className={classes.spacingBread}>
                    <StyledBreadcrumb label="Movimiento Semana" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/libro-diario/${id}`)} />
                    <StyledBreadcrumb label="Movimiento Mes" onClick={() => navigate(`/maindrawer/cierre-caja/${id}`)} />
                    <StyledBreadcrumb label="Busqueda Semana" onClick={() => navigate(`/maindrawer/balance-semana/${id}`)} />
                    <StyledBreadcrumb label="Busqueda Mes" onClick={() => navigate(`/maindrawer/balance-mes/${id}`)} />
                </Breadcrumbs>
                <MaterialTable
                    title='Reporte de Movimientos'
                    data={libro}
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
                            tooltip: 'Guardar los datos seleccinados',
                            icon: 'save',
                            onClick: (evt, data) => openModalSemana(data),
                        }
                    ]}
                />
            </Container>
            <Dialog
                open={openModal}
                onClose={closeModalSemana}
                maxWidth='md'
            >
                <Paper component={Box} p={2}>
                    <Typography variant='h6' align='center'>Registro Semanal</Typography>
                    <Typography variant='subtitle2' style={{color:'red'}} align='center'>Se Recomienda guardar la información de Lunes a Domingo</Typography>
                    <form onSubmit={postLibroSemana}>
                        <div style={{margin:15}}>
                            <Typography variant='h6'>Ingreso: {ingreso.current} Bs.</Typography>
                            <Typography variant='h6'>Egreso: {egreso.current} Bs.</Typography>
                            <Typography variant='h6'>Total: {total.current} Bs.</Typography>
                        </div>
                        <Grid container direction='row' justifyContent='center'>
                            <TextField
                                label='fecha inicio'
                                variant='outlined'
                                size='small'
                                type='date'
                                style={{ padding: 2 }}
                                InputLabelProps={{ shrink: true }}
                                inputRef={fechaInicio}
                                required
                            />
                            <TextField
                                label='fecha inicio'
                                variant='outlined'
                                size='small'
                                type='date'
                                style={{ padding: 2 }}
                                InputLabelProps={{ shrink: true }}
                                inputRef={fechaFin}
                                required
                            />
                        </Grid>
                        <Button type='submit' variant='contained' fullWidth size='small' endIcon={<SaveIcon />} style={{ background: '#43a047', color: 'white', textTransform: 'capitalize', marginTop: 15 }}>Guardar</Button>
                    </form>
                </Paper>
            </Dialog>
        </>
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


