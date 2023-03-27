import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AddClient } from '../../../Components/Molecules/Clients/ActionClient'

const ipcRenderer = window.require('electron').ipcRenderer


export const ListViewClients = () => {
  const classes = useStyles()
  const [clients,setClients]=useState([])
  useEffect(()=>{
    getAllClients()
  },[])

  const getAllClients=async()=>{
    await ipcRenderer.invoke('get-all-clients')
    .then(resp=>setClients(JSON.parse(resp)))
    .catch(err=>console.log(err))
  }
  const data = [
    { nombre: 'Maria', ci: 9876588, cel: '69521423', address: 'Calle Serrano', total: 7 },
    { nombre: 'Edwar', ci: 5226588, cel: '69554423', address: 'Av. Litoral', total: 2 },
    { nombre: 'Ronnal', ci: 3176555, cel: '85521423', address: 'San Juan', total: 5 },
    { nombre: 'Pedro', ci: 9876588, cel: '69521423', address: 'Nueva Terminal', total: 10 },
    { nombre: 'Romina', ci: 9876588, cel: '6655323', address: 'Alto Potosi', total: 15 },
    { nombre: 'Judas', ci: 65545488, cel: '99562423', address: 'Pailaviri', total: 1 },
    { nombre: 'Marcela', ci: 996555, cel: '96511153', address: 'Bolivar', total: 6 },
    { nombre: 'Criz', ci: 65151545, cel: '699665513', address: 'Av. Arce', total: 7 },
    { nombre: 'Jeovana', ci: 5544511, cel: '665451423', address: 'Millares', total: 1 },
    { nombre: 'Alex', ci: 9864656, cel: '69663123', address: 'Agustin Udgarde', total: 9 },
  ]
  console.log(clients)
  return (
    <Container>
      <Typography className={classes.alignTextTitle} variant='h5' >Administrar Clientes</Typography>
      <AddClient getClients={getAllClients}/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N°</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cedula de Identidad</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Total Compras</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length>0? (clients.map((e, index) => (
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{e.client_name} {e.client_surname_p} {e.client_surname_m}</TableCell>
                <TableCell>{e.client_ci}</TableCell>
                <TableCell>{e.client_phone}</TableCell>
                <TableCell>{e.client_address}</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Button size='small' color='primary'>edit</Button>
                  <Button size='small' color='secondary'>delete</Button>
                </TableCell>
              </TableRow>
            ))):null}
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
