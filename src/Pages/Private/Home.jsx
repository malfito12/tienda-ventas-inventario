import { Box, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { useNavigate } from 'react-router-dom';
import MainAppBar from '../../Components/Molecules/MainAppBar';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import { AuthContext } from '../../Components/Atoms/AuthContext';
const ipcRenderer = window.require('electron').ipcRenderer



const Home = () => {
  const{setIdSucursal}=useContext(AuthContext)
  const navigate = useNavigate()
  const classes = useStyles()
  const [sucursales, setSucursales] = useState([])

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    getAllSucursales()
  }, [])



  // ------------------- GET SUCURSALES------------------------
  const getAllSucursales = async () => {
    try {
      await ipcRenderer.invoke('get-all-sucursales')
        .then(resp => {
          setSucursales(JSON.parse(resp))
        })
    } catch (error) {
      console.log(error)
    }
  }
  const asigIdSuc=(id)=>{
    navigate(`/maindrawer/sucursal/${id}`)
    setIdSucursal(id)
  }
  return (
    <>
      <MainAppBar menu={handleDrawerToggle} />
      <div className={classes.toolbar} />
      <Container>
        <Grid container justifyContent='center' alignItems='center'>
          {sucursales.length > 0 ? (
            sucursales.map((e, index) => (
              <Box key={index} className={classes.sucursalSpacing}>
                <IconButton onClick={()=>asigIdSuc(e.sucursal_id)}>
                  <HomeWorkIcon className={classes.sucursalIcon} />
                  <Typography variant='h5' align='center' className={classes.sucursalTitle}>{e.sucursal_name}</Typography>
                </IconButton>
              </Box>
            ))

          ) : (null)}
          <Box className={classes.sucursalSpacing}>
            <IconButton onClick={() => navigate(`/registro-sucursal`)}>
              <AddCircleSharpIcon className={classes.sucursalIcon} />
              <Typography variant='h5' align='center' className={classes.sucursalTitle}>Registro Sucursal</Typography>
            </IconButton>
          </Box>

        </Grid>
      </Container>
    </>
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