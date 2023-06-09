import React, { useContext, useEffect, useState } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@material-ui/core';
import { AddTypeProduct, DeleteType, EditTypeProduct } from '../../../Components/Molecules/Products/AddTypeProduct';
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

export default function ListViewTypeProduct() {
    const navigate = useNavigate()
    const { idSuc } = useContext(AuthContext)
    const { id } = useParams()
    const classes = useStyles()
    const [type, setType] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getAllUnidadMedida()
    }, [])

    const getAllUnidadMedida = async () => {
        setLoading(true)
        await ipcRenderer.invoke('get-all-type-product', idSuc)
            .then(resp => setType(JSON.parse(resp)))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }
    //---------------------------------------------------
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <Container>
            <Breadcrumbs>
                <StyledBreadcrumb label="Productos" onClick={() => navigate(`/home/maindrawer/almacen/${id}`)} />
                <StyledBreadcrumb label="Tipo de Producto" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/tipo-producto/${id}`)} />
                <StyledBreadcrumb label="Unidad de Medida" onClick={() => navigate(`/home/maindrawer/unidad-medida/${id}`)} />
            </Breadcrumbs>
            <div align='right'>
                <AddTypeProduct getType={getAllUnidadMedida} />
            </div>
            <TableContainer component={Paper} style={{ maxHeight: '65vh'}}   >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.colorHead}>N°</TableCell>
                            <TableCell className={classes.colorHead}>Nombre Tipo Producto</TableCell>
                            <TableCell className={classes.colorHead}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {type.length > 0 ? (
                            type.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell size='small'>{index + 1}</TableCell>
                                    <TableCell size='small'>{e.type_name}</TableCell>
                                    <TableCell size='small'>
                                        <Tooltip title='Actualizar'>
                                            <EditTypeProduct data={e} getType={getAllUnidadMedida} />
                                        </Tooltip>
                                        <Tooltip title='Eliminar'>
                                            <DeleteType data={e} getType={getAllUnidadMedida} />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align='center'>{loading ? <CircularProgress /> : 'No Existe Información'}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                style={{ background: '#424242', color: 'white' }}
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={type.length}
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
        padding: 13
    }
}))
