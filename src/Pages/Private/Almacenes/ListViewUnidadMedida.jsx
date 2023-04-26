import React, { useContext, useEffect, useState } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import {AddUnidadMedida,EditUnidadMedida,DeleteUnidadMedida} from '../../../Components/Molecules/Products/AddUnidadMedida';
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

export default function ListViewUnidadMedida() {
    const navigate = useNavigate()
    const { id } = useParams()
    const {idSuc}=useContext(AuthContext)
    const classes = useStyles()
    const [unidad, setUnidad] = useState([])
    useEffect(() => {
        getAllUnidadMedida()
    }, [])

    const getAllUnidadMedida = async () => {
        await ipcRenderer.invoke('get-all-unidad-medida',idSuc)
            .then(resp => setUnidad(JSON.parse(resp)))
            .catch(err => console.log(err))
    }
    // console.log(unidad)
    return (
        <Container>
            <Breadcrumbs className={classes.spacingBread}>
                <StyledBreadcrumb label="Productos" onClick={() => navigate(`/home/maindrawer/almacen/${id}`)} />
                <StyledBreadcrumb label="Tipo de Producto" onClick={() => navigate(`/home/maindrawer/tipo-producto/${id}`)} />
                <StyledBreadcrumb label="Unidad de Medida" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/unidad-medida/${id}`)} />
            </Breadcrumbs>
            <div align='right'>
                <AddUnidadMedida getUnidades={getAllUnidadMedida}/>
            </div>
            <TableContainer component={Paper} style={{ maxHeight: 500 }}  >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.colorHead}>N°</TableCell>
                            <TableCell className={classes.colorHead}>Nombre Unidad Medida</TableCell>
                            <TableCell className={classes.colorHead}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unidad.length > 0 ? (
                            unidad.map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell size='small'>{index+1}</TableCell>
                                    <TableCell size='small'>{e.u_medida_name}</TableCell>
                                    <TableCell size='small'>
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
    },
    colorHead:{
        background:'#424242',
        color:'white',
        padding:13
      }
}))
