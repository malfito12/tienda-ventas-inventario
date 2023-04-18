import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../Components/Atoms/AuthContext'
const ipcRenderer = window.require('electron').ipcRenderer


export default function KardexProducto() {
    const { id } = useParams()
    const { idSuc } = useContext(AuthContext)
    const [kardex, setKardex] = useState([])

    useEffect(() => {
        getMoveProducts()
    }, [])

    const getMoveProducts = async () => {
        const data = {
            sucursal_id: idSuc,
            product_id: id
        }
        await ipcRenderer.invoke('get-kardex-product', data)
            .then(resp => setKardex(JSON.parse(resp)))
            .catch(err => console.log(err))
    }
    // console.log(kardex)
    return (
        <Container>
            <Typography variant='h5' align='center' style={{ marginBottom: 20 }}>MOVIMIENTO DE PRODUCTOS</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2}>N°</TableCell>
                            <TableCell rowSpan={2}>Fecha</TableCell>
                            <TableCell rowSpan={2}>Nombre</TableCell>
                            <TableCell colSpan={2}>Entradas</TableCell>
                            <TableCell colSpan={2}>Salidas</TableCell>
                            <TableCell colSpan={2}>Total</TableCell>
                            {/* <TableCell rowSpan={2}>Precio Unitario</TableCell> */}
                            {/* <TableCell rowSpan={2}>Acciones</TableCell> */}
                        </TableRow>
                        <TableRow>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {kardex.length > 0?(
                            kardex.map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{e.to_char}</TableCell>
                                    <TableCell>{e.product_name}</TableCell>
                                    <TableCell>{e.move_id===1?e.product_move_price:''}</TableCell>
                                    <TableCell>{e.move_id===1?e.product_move_amount:''}</TableCell>
                                    <TableCell>{e.move_id===2?e.product_move_price:''}</TableCell>
                                    <TableCell>{e.move_id===2?e.product_move_amount:''}</TableCell>
                                    <TableCell>{e.product_total_price}</TableCell>
                                    <TableCell>{e.product_total_amount}</TableCell>
                                </TableRow>
                            ))
                        ):null}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}
