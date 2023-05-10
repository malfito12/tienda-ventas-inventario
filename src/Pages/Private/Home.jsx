import { Box, CircularProgress, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { useNavigate } from 'react-router-dom';
import MainAppBar from '../../Components/Molecules/MainAppBar';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { AuthContext } from '../../Components/Atoms/AuthContext';
const ipcRenderer = window.require('electron').ipcRenderer



const Home = () => {
  const { setIdSucursal } = useContext(AuthContext)
  const navigate = useNavigate()
  const classes = useStyles()
  const [sucursales, setSucursales] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    getAllSucursales()
  }, [])



  // ------------------- GET SUCURSALES------------------------
  const getAllSucursales = async () => {
    setLoading(true)
    await ipcRenderer.invoke('get-all-sucursales')
      .then(resp => {
        setSucursales(JSON.parse(resp))
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))

  }
  //-------------------------------------------------------------------
  const asigIdSuc = (e) => {
    const id = e.sucursal_id
    setIdSucursal(e)
    navigate(`/home/maindrawer/sucursal/${id}`)
  }
  return (
    <div className='otro'>
      <MainAppBar menu={handleDrawerToggle} />
      <div className={classes.toolbar} />
      <Container>
        <Grid style={{ marginTop: 25 }} container justifyContent='center' alignItems='center'>
          {loading ? <CircularProgress /> : (
            <>
              {sucursales.length > 0 ? (
                sucursales.map((e, index) => (
                  <Box key={index} className={classes.sucursalSpacing}>
                    <IconButton onClick={() => asigIdSuc(e)}>
                      <ApartmentIcon style={{ color: '#424242' }} className={classes.sucursalIcon} />
                      <Typography style={{ color: '#e0e0e0' }} variant='h5' align='center' className={classes.sucursalTitle}>{e.sucursal_name}</Typography>
                    </IconButton>
                  </Box>
                ))
              ) : (null)}
              <Box className={classes.sucursalSpacing}>
                <IconButton onClick={() => navigate(`/home/registro-sucursal`)}>
                  <AddCircleSharpIcon style={{ color: '#424242' }} className={classes.sucursalIcon} />
                  <Typography style={{ color: '#e0e0e0' }} variant='h5' align='center' className={classes.sucursalTitle}>Registro Sucursal</Typography>
                </IconButton>
              </Box>
            </>
          )}
        </Grid>
      </Container>
    </div>
  )
}

export default Home

const useStyles = makeStyles((theme) => ({
  sucursalIcon: {
    fontSize: 170,
  },
  sucursalSpacing: {
    marginLeft: 20,
    marginRight: 20
  },
  sucursalTitle: {
    position: 'absolute',
    color: 'black',
    fontWeight: 'bold'
  },
  toolbar: theme.mixins.toolbar,
}))