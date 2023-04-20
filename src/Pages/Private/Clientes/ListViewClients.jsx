import { Avatar, Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddClient, DeleteClient, UpdateClient } from '../../../Components/Molecules/Clients/ActionClient'

const ipcRenderer = window.require('electron').ipcRenderer


export const ListViewClients = () => {
  const classes = useStyles()
  const [clients, setClients] = useState([])
  useEffect(() => {
    getAllClients()
  }, [])

  const getAllClients = async () => {
    await ipcRenderer.invoke('get-all-clients')
      .then(resp =>{ 
        setClients(JSON.parse(resp))
      })
      .catch(err => console.log(err))
  }

  // console.log(clients)
  return (
    <Container>
      <Typography className={classes.alignTextTitle} variant='h5' >Administrar Clientes</Typography>
      <AddClient getClients={getAllClients} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N°</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Cedula de Identidad</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length > 0 ? (clients.map((e, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell size='small'>
                  <Avatar style={{width:35,height:35}}>{`${(e.client_name).charAt(0)}${(e.client_surname_p).charAt(0)}`}</Avatar>
                </TableCell>
                <TableCell>{e.client_name} {e.client_surname_p} {e.client_surname_m}</TableCell>
                <TableCell>{e.client_ci}</TableCell>
                <TableCell>{e.client_phone}</TableCell>
                <TableCell>{e.client_address}</TableCell>
                <TableCell>
                  <UpdateClient data={e} getClients={getAllClients} />
                  <DeleteClient data={e} getClients={getAllClients} />
                </TableCell>
              </TableRow>
            ))) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  alignTextTitle: {
    marginBottom: 20
  }
}))
