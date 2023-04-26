import { Avatar, Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddClient, DeleteClient, UpdateClient } from '../../../Components/Molecules/Clients/ActionClient'

const ipcRenderer = window.require('electron').ipcRenderer


export const ListViewClients = () => {
  const classes = useStyles()
  const [clients, setClients] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    getAllClients()
  }, [])

  const getAllClients = async () => {
    await ipcRenderer.invoke('get-all-clients')
      .then(resp => {
        setClients(JSON.parse(resp))
      })
      .catch(err => console.log(err))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // console.log(clients)
  return (
    <Container>
      <Typography className={classes.alignTextTitle} variant='h5' >Administrar Clientes</Typography>
      <AddClient getClients={getAllClients} />
      <TableContainer component={Paper} style={{ maxHeight: 500 }}>
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
            {clients.length > 0 ? (clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, index) => (
              <TableRow key={index}>
                <TableCell size='small'>{index + 1}</TableCell>
                <TableCell size='small'>
                  <Avatar style={{ width: 35, height: 35 }}>{`${(e.client_name).charAt(0)}${(e.client_surname_p).charAt(0)}`}</Avatar>
                </TableCell>
                <TableCell size='small'>{e.client_name} {e.client_surname_p} {e.client_surname_m}</TableCell>
                <TableCell size='small'>{e.client_ci}</TableCell>
                <TableCell size='small'>{e.client_phone}</TableCell>
                <TableCell size='small'>{e.client_address}</TableCell>
                <TableCell size='small'>
                  <UpdateClient data={e} getClients={getAllClients} />
                  <DeleteClient data={e} getClients={getAllClients} />
                </TableCell>
              </TableRow>
            ))) : null}
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
    marginBottom: 20
  },
  colorHead: {
    background: '#424242',
    color: 'white',
    padding: 13
  }
}))
