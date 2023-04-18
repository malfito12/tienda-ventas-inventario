import React, { useContext, useEffect, useState } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
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

    useEffect(() => {
        getAllProducts()
    }, [])

    //--------------GET PRODUCT------------------
    const getAllProducts = async () => {
        await ipcRenderer.invoke('get-all-products', idSuc)
            .then(resp => setProducts(JSON.parse(resp)))
            .catch(err => console.log(err))
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
                // deleteProduct()
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
            }
        })
    }

    // console.log(products)
    return (
        <Container fixed>
            <Breadcrumbs className={classes.spacingBread}>
                {/* <StyledBreadcrumb label="Productos" style={{color:'black',fontSize:15}} icon={<HomeIcon fontSize="small" />} onClick={() => navigate(`/almacen/${id}`)} /> */}
                <StyledBreadcrumb label="Productos" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/almacen/${id}`)} />
                <StyledBreadcrumb label="Tipo de Producto" onClick={() => navigate(`/maindrawer/tipo-producto/${id}`)} />
                <StyledBreadcrumb label="Unidad de Medida" onClick={() => navigate(`/maindrawer/unidad-medida/${id}`)} />
            </Breadcrumbs>
            <div align='right'>
                <AddProduct getProducts={getAllProducts} />
            </div>
            <TableContainer component={Paper}   >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>N°</TableCell>
                            <TableCell align='center'>imagen</TableCell>
                            <TableCell align='center'>Nombre de Producto</TableCell>
                            <TableCell align='center'>Codigo de Producto</TableCell>
                            <TableCell align='center'>Cantidad Total Stock</TableCell>
                            <TableCell align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell align='center'>
                                        <IconButton size='small' onClick={() => openImages(e.product_image)}>
                                            <img src={e.product_image} style={{ width: '50px', height: '50px' }} alt='#' />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align='center'>{e.product_name}</TableCell>
                                    {/* <TableCell>{e.product_total_amount}</TableCell> */}
                                    <TableCell align='center'>{e.product_code}</TableCell>
                                    <TableCell align='center'>{e.stock}</TableCell>
                                    <TableCell align='center'>
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
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>
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
    }
}))
