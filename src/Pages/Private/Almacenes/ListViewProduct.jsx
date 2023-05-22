import React, { useContext, useEffect, useState } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress, Container, Grid, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@material-ui/core';
import { AddProduct, UpdateProduct } from '../../../Components/Molecules/Products/AddProduct';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import VideoLabelSharpIcon from '@material-ui/icons/VideoLabelSharp';
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

export default function ListViewProduct() {
    const { idSuc } = useContext(AuthContext)
    const navigate = useNavigate()
    const { id } = useParams()
    const classes = useStyles()
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getAllProducts()
    }, [])

    //--------------GET PRODUCT------------------
    const getAllProducts = async () => {
        setLoading(true)
        await ipcRenderer.invoke('get-all-products', idSuc)
            .then(resp => {
                setProducts(JSON.parse(resp))
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

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
    //-------OPEN IMAGEN---------------------


    const openImages = (e) => {
        Swal.fire({
            // title: 'Sweet!',
            // text: 'Modal with a custom image.',
            // imageUrl: 'https://unsplash.it/400/200',
            imageUrl: e,
            imageWidth: 400,
            imageHeight: 400,
            showCloseButton: true,
            showConfirmButton: false

        })
    }

    //-------DELETE PRODUCT---------------------

    const openCloseModalDelete = (id) => {
        // console.log(id)
        Swal.fire({
            title: 'Estas Seguro de Eliminar?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            text: "El Producto se Eliminará por completo!!",
            icon: 'warning',
        }).then(async resp => {
            if (resp.isConfirmed) {
                Swal.showLoading()
                await ipcRenderer.invoke('delete-product', id)
                    .then(resp => {
                        const response = JSON.parse(resp)
                        if (response.status === 300) {
                            // Swal.fire('Eliminado', response.message, 'error')
                            Toast.fire({ icon: 'error', title: response.message })
                            return
                        }
                        Toast.fire({ icon: 'success', title: response.message })
                        // Swal.fire('Success', response.message, 'success')
                        getAllProducts()
                    })
                    .catch(err => Toast.fire({ icon: 'success', title: err }))
            }
        })
    }
    //---------------------------BUSCADOR---------------------------------------------
    const [buscador, setBuscador] = useState("")

    const buscarProducto = (buscador) => {
        return function (x) {
            return x.product_name.includes(buscador) ||
                x.product_name.toLowerCase().includes(buscador) ||
                x.type_name.includes(buscador) ||
                x.type_name.toLowerCase().includes(buscador) ||
                x.product_code.toString().includes(buscador) ||
                !buscador
        }
    }
    //-------------------------------------------
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // console.log(products)
    return (
        <Container maxWidth={false}>
            <Breadcrumbs>
                {/* <StyledBreadcrumb label="Productos" style={{color:'black',fontSize:15}} icon={<HomeIcon fontSize="small" />} onClick={() => navigate(`/almacen/${id}`)} /> */}
                <StyledBreadcrumb label="Productos" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/almacen/${id}`)} />
                <StyledBreadcrumb label="Tipo de Producto" onClick={() => navigate(`/home/maindrawer/tipo-producto/${id}`)} />
                <StyledBreadcrumb label="Unidad de Medida" onClick={() => navigate(`/home/maindrawer/unidad-medida/${id}`)} />
            </Breadcrumbs>
            <Grid container direction='row' justifyContent='flex-end' alignItems='center' item xs={12} style={{ marginBottom: 10 }}>
                <AddProduct refGet={1} getProducts={getAllProducts} />
                <Typography variant='subtitle1' style={{ marginRight: 10, marginLeft: 25, color: '#e0e0e0' }} >Buscar</Typography>
                <TextField
                    variant='outlined'
                    size='small'
                    style={{ width: '30%', background: 'white', borderRadius: 5 }}
                    onChange={e => setBuscador(e.target.value)}
                />
            </Grid>
            <TableContainer component={Paper} style={{ maxHeight: '65vh'}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.colorHead}>N°</TableCell>
                            <TableCell className={classes.colorHead} align='center'>imagen</TableCell>
                            <TableCell className={classes.colorHead} align='center'>Codigo</TableCell>
                            <TableCell className={classes.colorHead} align='center'>Tipo</TableCell>
                            <TableCell className={classes.colorHead} align='center'>Nombre de Producto</TableCell>
                            <TableCell className={classes.colorHead} align='center'>Cantidad Total Stock</TableCell>
                            <TableCell className={classes.colorHead} align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.filter(buscarProducto(buscador)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell size='small' style={{fontSize:12}}>{index + 1}</TableCell>
                                    <TableCell size='small' align='center' style={{fontSize:12}}>
                                        <IconButton size='small' onClick={() => openImages(e.product_image)}>
                                            <img src={e.product_image} style={{ width: '35px', height: '35px', borderRadius: 25 }} alt='#' />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell size='small' align='center' style={{fontSize:12}}>{e.product_code}</TableCell>
                                    <TableCell size='small' align='center' style={{fontSize:12}}>{e.type_name}</TableCell>
                                    <TableCell size='small' align='center' style={{fontSize:12}}>{e.product_name}</TableCell>
                                    <TableCell size='small' align='center' style={{fontSize:12}}>{e.stock}</TableCell>
                                    <TableCell size='small' align='center' style={{fontSize:12}}>
                                        <UpdateProduct data={e} getProducts={getAllProducts} />
                                        <Tooltip title='Eliminar'>
                                            <IconButton onClick={() => openCloseModalDelete(e.product_id)} size='small' style={{ background: '#f44336', color: 'white', marginRight: 5 }}>
                                                <DeleteForeverSharpIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {/* <Tooltip title='Ver Movimientos'>
                                            <IconButton size='small' style={{ background: '#1565c0', color: 'white', marginRight: 5 }} onClick={() => navigate(`/maindrawer/kardex-producto/${e.product_id}`)}>
                                                <VideoLabelSharpIcon />
                                            </IconButton>
                                        </Tooltip> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align='center'>{loading ? <CircularProgress /> : 'No Existe Informacion'}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                style={{ background: '#424242', color: 'white' }}
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
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
    },
    colorHead: {
        background: '#424242',
        color: 'white',
        padding: 13,
        fontSize:12
    }
}))
