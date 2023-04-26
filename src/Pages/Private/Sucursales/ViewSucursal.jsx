import { Box, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import QuickChart from 'quickchart-js'
import StoreIcon from '@material-ui/icons/Store';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import AddBoxIcon from '@material-ui/icons/AddBox';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
const ipcRenderer = window.require('electron').ipcRenderer


const ViewSucursal = () => {
    const { idSuc } = useContext(AuthContext)
    const navigate = useNavigate()
    const classes = useStyles()
    const { id } = useParams()
    const [sucursal, setSucursal] = useState([])

    useEffect(() => {
        getSucursal()
    }, [])
    // ---------------------GET SUCURSAL-------------------

    const getSucursal = async () => {
        try {
            await ipcRenderer.invoke('get-sucursal', id)
                .then(resp => setSucursal(JSON.parse(resp)))
                .catch(err => console.log(err))
        } catch (error) {
            console.log(error)
        }
    }
    const navigationAlmacen = () => {
        navigate(`/home/maindrawer/almacen/${idSuc}`)
    }
    const myChart = new QuickChart()
    return (
        <Container>{sucursal.length > 0 ? (
            <>
                <Typography style={{color:'#e0e0e0', marginBottom:15}} align='center' variant='h4'>Sucursal {sucursal[0].sucursal_name}</Typography>
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                    <Box  className={classes.sucursalSpacing}>
                        {/* <IconButton onClick={navigation}> */}
                        <IconButton style={{background:'#9e9e9e'}} onClick={navigationAlmacen}>
                            <StoreIcon style={{color:'#424242'}} className={classes.sucursalIcon} />
                            <Typography style={{color:'#e0e0e0'}} variant='h5' align='center' className={classes.sucursalTitle}>ALMACEN</Typography>
                        </IconButton>
                    </Box>
                    <Box className={classes.sucursalSpacing}>
                        <IconButton style={{background:'#9e9e9e'}} onClick={() => navigate(`/home/maindrawer/ventas/${idSuc}`)}>
                            <LocalGroceryStoreIcon style={{color:'#424242'}} className={classes.sucursalIcon} />
                            <Typography style={{color:'#e0e0e0'}} variant='h5' align='center' className={classes.sucursalTitle}>VENTA DE PRODUCTOS</Typography>
                        </IconButton>
                    </Box>
                    <Box className={classes.sucursalSpacing}>
                        <IconButton style={{background:'#9e9e9e'}} onClick={() => navigate(`/home/maindrawer/registro-producto/${idSuc}`)}>
                            <AddBoxIcon style={{color:'#424242'}} className={classes.sucursalIcon} />
                            <Typography style={{color:'#e0e0e0'}} variant='h5' align='center' className={classes.sucursalTitle}>REGISTRO DE PRODUCTOS</Typography>
                        </IconButton>
                    </Box>
                    <Box className={classes.sucursalSpacing}>
                        <IconButton style={{background:'#9e9e9e'}} onClick={() => navigate(`/home/maindrawer/clientes/${idSuc}`)}>
                            <NaturePeopleIcon style={{color:'#424242'}} className={classes.sucursalIcon} />
                            <Typography style={{color:'#e0e0e0'}} variant='h5' align='center' className={classes.sucursalTitle}>CLIENTES</Typography>
                        </IconButton>
                    </Box>
                    <Box className={classes.sucursalSpacing}>
                        <IconButton style={{background:'#9e9e9e'}} onClick={() => navigate(`/home/maindrawer/libro-diario/${idSuc}`)}>
                            <CheckBoxIcon style={{color:'#424242'}} className={classes.sucursalIcon} />
                            <Typography style={{color:'#e0e0e0'}} variant='h5' align='center' className={classes.sucursalTitle}>CIERRE DE CAJA</Typography>
                        </IconButton>
                    </Box>
                    {/* <img src={`https://quickchart.io/qr?text=${JSON.stringify(sucursal)}`} /> */}
                </Grid>
            </>


        ) : (
            <Typography align='center' variant='h4'>No Existe Informacion</Typography>
        )}
        </Container>
    )
}

export default ViewSucursal

const useStyles = makeStyles((theme) => ({
    sucursalIcon: {
        fontSize: 170,
    },
    sucursalSpacing: {
        marginLeft: 20,
        marginRight: 20,
    },
    sucursalTitle: {
        position: 'absolute',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    }
}))