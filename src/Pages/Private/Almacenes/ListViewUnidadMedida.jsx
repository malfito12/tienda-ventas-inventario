import React, { useEffect, useState } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import {AddUnidadMedida,EditUnidadMedida,DeleteUnidadMedida} from '../../../Components/Molecules/Products/AddUnidadMedida';
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

export default function ListViewUnidadMedida() {
    const navigate = useNavigate()
    const { id } = useParams()
    const classes = useStyles()
    const [unidad, setUnidad] = useState([])
    useEffect(() => {
        getAllUnidadMedida()
    }, [])

    const getAllUnidadMedida = async () => {
        await ipcRenderer.invoke('get-all-unidad-medida')
            .then(resp => setUnidad(JSON.parse(resp)))
            .catch(err => console.log(err))
    }
    // console.log(unidad)
    return (
        <Container>
            <Breadcrumbs className={classes.spacingBread}>
                <StyledBreadcrumb label="Productos" onClick={() => navigate(`/maindrawer/almacen/${id}`)} />
                <StyledBreadcrumb label="Tipo de Producto" onClick={() => navigate(`/maindrawer/tipo-producto/${id}`)} />
                <StyledBreadcrumb label="Unidad de Medida" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/unidad-medida/${id}`)} />
            </Breadcrumbs>
            <div align='right'>
                <AddUnidadMedida getUnidades={getAllUnidadMedida}/>
            </div>
            <TableContainer component={Paper}   >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>N°</TableCell>
                            <TableCell>Nombre Unidad Medida</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unidad.length > 0 ? (
                            unidad.map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{e.u_medida_name}</TableCell>
                                    <TableCell>
                                        <EditUnidadMedida data={e} getUnidad={getAllUnidadMedida}/>
                                        <DeleteUnidadMedida data={e} getUnidad={getAllUnidadMedida} />
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