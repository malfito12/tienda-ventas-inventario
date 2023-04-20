import React, { useContext, useEffect, useState } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import {AddTypeProduct, DeleteType, EditTypeProduct} from '../../../Components/Molecules/Products/AddTypeProduct';
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
    const {idSuc}=useContext(AuthContext)
    const { id } = useParams()
    const classes = useStyles()
    const [type, setType] = useState([])
    useEffect(() => {
        getAllUnidadMedida()
    }, [])

    const getAllUnidadMedida = async () => {
        await ipcRenderer.invoke('get-all-type-product',idSuc)
            .then(resp => setType(JSON.parse(resp)))
            .catch(err => console.log(err))
    }
    return (
        <Container>
            <Breadcrumbs className={classes.spacingBread}>
                <StyledBreadcrumb label="Productos" onClick={() => navigate(`/maindrawer/almacen/${id}`)} />
                <StyledBreadcrumb label="Tipo de Producto" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/tipo-producto/${id}`)} />
                <StyledBreadcrumb label="Unidad de Medida" onClick={() => navigate(`/maindrawer/unidad-medida/${id}`)} />
            </Breadcrumbs>
            <div align='right'>
                <AddTypeProduct getType={getAllUnidadMedida} />
            </div>
            <TableContainer component={Paper}   >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>N°</TableCell>
                            <TableCell>Nombre Tipo Producto</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {type.length > 0 ? (
                            type.map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{e.type_name}</TableCell>
                                    <TableCell>
                                        <Tooltip title='Actualizar'>
                                            <EditTypeProduct data={e} getType={getAllUnidadMedida} />
                                        </Tooltip>
                                        <Tooltip title='Eliminar'>
                                            <DeleteType data={e} getType={getAllUnidadMedida} />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (null)}
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
