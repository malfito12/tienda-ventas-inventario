import { Avatar, Button, CircularProgress, Container, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddClient, DeleteClient, UpdateClient } from '../../../Components/Molecules/Clients/ActionClient'

const ipcRenderer = window.require('electron').ipcRenderer


export const ListViewClients = () => {
  const classes = useStyles()
  const [clients, setClients] = useState([])
  const [loading,setLoading]=useState(false)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    getAllClients()
  }, [])

  const getAllClients = async () => {
    setLoading(true)
    await ipcRenderer.invoke('get-all-clients')
      .then(resp => {
        setClients(JSON.parse(resp))
      })
      .catch(err => console.log(err))
      .finally(()=>setLoading(false))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //---------------------------BUSCADOR---------------------------------------------
  const [buscador, setBuscador] = useState("")

  const buscarCliente = (buscador) => {
    return function (x) {
      return x.client_ci.toString().includes(buscador) ||
        // {e.client_name} {e.client_surname_p} {e.client_surname_m}
        x.client_name.includes(buscador) ||
        x.client_name.toLowerCase().includes(buscador) ||
        x.client_surname_p.includes(buscador) ||
        x.client_surname_p.toLowerCase().includes(buscador) ||
        x.client_surname_m.includes(buscador) ||
        x.client_surname_m.toLowerCase().includes(buscador) ||
        !buscador
    }
  }
  // console.log(clients)
  return (
    <Container>
      <Typography className={classes.alignTextTitle} variant='h5' >Administrar Clientes</Typography>
      <Grid container direction='row' justifyContent='flex-end' alignItems='center' item xs={12} style={{ marginBottom: 10 }}>
        <AddClient refGet={1} getClients={getAllClients} />
        <Typography variant='subtitle1' style={{ marginRight: 10, marginLeft: 25, color: '#e0e0e0' }} >Buscar</Typography>
        <TextField
          label='Numero de CI'
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
              <TableCell className={classes.colorHead}>Nombre</TableCell>
              <TableCell className={classes.colorHead}>Avatar</TableCell>
              <TableCell className={classes.colorHead}>Cedula de Identidad</TableCell>
              <TableCell className={classes.colorHead}>Telefono</TableCell>
              <TableCell className={classes.colorHead}>Direccion</TableCell>
              <TableCell className={classes.colorHead}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length > 0 ? (clients.filter(buscarCliente(buscador)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, index) => (
              <TableRow key={index}>
                <TableCell size='small' style={{fontSize:12}}>{index + 1}</TableCell>
                <TableCell size='small'style={{fontSize:12}}>
                  <Avatar style={{ width: 25, height: 25 }}>{`${(e.client_name).charAt(0)}${(e.client_surname_p).charAt(0)}`}</Avatar>
                </TableCell>
                <TableCell size='small' style={{fontSize:12}}>{e.client_name} {e.client_surname_p} {e.client_surname_m}</TableCell>
                <TableCell size='small' style={{fontSize:12}}>{e.client_ci}</TableCell>
                <TableCell size='small' style={{fontSize:12}}>{e.client_phone}</TableCell>
                <TableCell size='small' style={{fontSize:12}}>{e.client_address}</TableCell>
                <TableCell size='small' style={{fontSize:12}}>
                  <UpdateClient data={e} getClients={getAllClients} />
                  <DeleteClient data={e} getClients={getAllClients} />
                </TableCell>
              </TableRow>
            ))) : (
              <TableRow>
                <TableCell colSpan={7} align='center'>{loading?<CircularProgress/>:'No Existe Información'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        style={{ background: '#424242', color: 'white' }}
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={clients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  alignTextTitle: {
    color: '#e0e0e0'
  },
  colorHead: {
    background: '#424242',
    color: 'white',
    padding: 13,
    fontSize:12
  }
}))
