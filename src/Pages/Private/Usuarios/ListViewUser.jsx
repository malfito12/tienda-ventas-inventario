import { Avatar, Button, CircularProgress, Container, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddUser, CambioPass, DeleteUser, EditUser } from '../../../Components/Molecules/Users/AddUser'

const ipcRenderer = window.require('electron').ipcRenderer

const ListViewUser = () => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading,setLoading]=useState(false)
  useEffect(() => {
    getAllUsers()
  }, [])

  //-----------GET USERS----------------
  const getAllUsers = async () => {
    setLoading(true)
    await ipcRenderer.invoke('get-all-users')
      .then(resp =>{
        setUsers(JSON.parse(resp))
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

  const buscarUsuario = (buscador) => {
    return function (x) {
      return x.people_name.includes(buscador) ||
        x.people_name.toLowerCase().includes(buscador) ||
        x.user_name.includes(buscador) ||
        x.user_name.toLowerCase().includes(buscador) ||
        x.rol_name.includes(buscador) ||
        x.rol_name.toLowerCase().includes(buscador) ||
        !buscador
    }
  }
  // console.log(users)
  return (
    <Container>
      <Typography variant='h5' className={classes.alignTextTitle}>Administrar Usuarios</Typography>
      <Grid container direction='row' justifyContent='flex-end' alignItems='center' item xs={12} style={{ marginBottom: 10 }}>
        <AddUser getUsers={getAllUsers} />
        <Typography variant='subtitle1' style={{ marginRight: 10, marginLeft: 25, color: '#e0e0e0' }} >Buscar</Typography>
        <TextField
          variant='outlined'
          size='small'
          style={{ width: '30%', background: 'white', borderRadius: 5 }}
          onChange={e => setBuscador(e.target.value)}
        />
      </Grid>
      <TableContainer component={Paper} style={{ maxHeight: 500, }}>
        <Table stickyHeader>
          <TableHead >
            <TableRow >
              <TableCell className={classes.colorHead}>N°</TableCell>
              <TableCell className={classes.colorHead}>Avatar</TableCell>
              <TableCell className={classes.colorHead}>Nombre</TableCell>
              <TableCell className={classes.colorHead}>Nombre Usuario</TableCell>
              <TableCell className={classes.colorHead}>Rol</TableCell>
              <TableCell className={classes.colorHead}>Estado</TableCell>
              <TableCell className={classes.colorHead}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              // users.map((e, index) => (
              users.filter(buscarUsuario(buscador)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, index) => (
                <TableRow key={index}>
                  <TableCell size='small'>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar style={{ width: 35, height: 35 }}>{`${(e.people_name).charAt(0)}`}</Avatar>
                  </TableCell>
                  <TableCell size='small'>{e.people_name}</TableCell>
                  <TableCell size='small'>{e.user_name}</TableCell>
                  <TableCell size='small'>{e.rol_name}</TableCell>
                  {e.user_status === 'ACTIVO' ? <TableCell style={{ color: 'green' }}>{e.user_status}</TableCell> : <TableCell style={{ color: 'red' }}>{e.user_status}</TableCell>}

                  <TableCell size='small'>
                    <EditUser data={e} getUsers={getAllUsers} />
                    <CambioPass data={e} getUsers={getAllUsers} />
                    <DeleteUser data={e} getUsers={getAllUsers} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
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
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  )
}

export default ListViewUser

const useStyles = makeStyles((theme) => ({
  alignTextTitle: {
    marginBottom: 20,
    color: '#e0e0e0'
  },
  colorHead: {
    background: '#424242',
    color: 'white',
    padding: 13
  }
}))