import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddUser, DeleteUser, EditUser } from '../../../Components/Molecules/Users/AddUser'

const ipcRenderer = window.require('electron').ipcRenderer

const ListViewUser = () => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    getAllUsers()
  }, [])

  //-----------GET USERS----------------
  const getAllUsers = async () => {
    await ipcRenderer.invoke('get-all-users')
      .then(resp => setUsers(JSON.parse(resp)))
      .catch(err => console.log(err))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // console.log(users)
  return (
    <Container>
      <Typography variant='h5' className={classes.alignTextTitle}>Administrar Usuarios</Typography>
      <AddUser getUsers={getAllUsers} />
      <TableContainer component={Paper} style={{ maxHeight: 500, }}>
        <Table stickyHeader>
          <TableHead >
            <TableRow >
              <TableCell className={classes.colorHead}>N°</TableCell>
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
              users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, index) => (
                <TableRow key={index}>
                  <TableCell size='small'>{index + 1}</TableCell>
                  <TableCell size='small'>{e.people_name}</TableCell>
                  <TableCell size='small'>{e.user_name}</TableCell>
                  <TableCell size='small'>{e.rol_name}</TableCell>
                  {e.user_status === 'ACTIVO' ? <TableCell style={{ color: 'green' }}>{e.user_status}</TableCell> : <TableCell style={{ color: 'red' }}>{e.user_status}</TableCell>}

                  <TableCell size='small'>
                    <EditUser data={e} getUsers={getAllUsers} />
                    <DeleteUser data={e} getUsers={getAllUsers} />
                  </TableCell>
                </TableRow>
              ))
            ) : null}
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
    marginBottom: 20
  },
  colorHead: {
    background: '#424242',
    color: 'white',
    padding: 13
  }
}))