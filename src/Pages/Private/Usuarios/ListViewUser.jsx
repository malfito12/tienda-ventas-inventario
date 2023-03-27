import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddUser, DeleteUser, EditUser } from '../../../Components/Molecules/Users/AddUser'

const ipcRenderer = window.require('electron').ipcRenderer

const ListViewUser = () => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  useEffect(() => {
    getAllUsers()
  }, [])

  //-----------GET USERS----------------
  const getAllUsers = async () => {
    await ipcRenderer.invoke('get-all-users')
      .then(resp => setUsers(JSON.parse(resp)))
      .catch(err => console.log(err))
  }
  console.log(users)
  return (
    <Container>
      <Typography variant='h5' className={classes.alignTextTitle}>Administrar Usuarios</Typography>
      <AddUser getUsers={getAllUsers} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N°</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Nombre Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((e, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{e.people_name}</TableCell>
                  <TableCell>{e.user_name}</TableCell>
                  <TableCell>{e.rol_name}</TableCell>
                  {e.user_status==='ACTIVO'?<TableCell style={{color:'green'}}>{e.user_status}</TableCell>:<TableCell style={{color:'red'}}>{e.user_status}</TableCell>}
                  
                  <TableCell>
                    <EditUser data={e} getUsers={getAllUsers}/>
                    <DeleteUser data={e} getUsers={getAllUsers} />
                  </TableCell>
                </TableRow>
              ))
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default ListViewUser

const useStyles = makeStyles((theme) => ({
  alignTextTitle: {
    marginBottom: 20
  },
}))