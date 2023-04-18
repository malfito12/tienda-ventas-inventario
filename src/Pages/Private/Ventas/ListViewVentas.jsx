import { Breadcrumbs, Chip, Container, emphasize, withStyles, makeStyles, Paper, Box, Typography, Grid, Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import PrintIcon from '@material-ui/icons/Print';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid';


const ipcRenderer = window.require('electron').ipcRenderer

const StyledBreadcrumb = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[300],
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[300], 0.12),
        },
    },
}))(Chip);
export default function ListViewVentas() {
    const classes = useStyles()
    const navigate = useNavigate()
    const { id } = useParams()
    const { idSuc } = useContext(AuthContext)
    const [lista, setLista] = useState([])
    useEffect(() => {
        getAllRegisterVentas()
    }, [])

    //----LISTA REGISTRO DE VENTAS-------------------
    const getAllRegisterVentas = async () => {
        await ipcRenderer.invoke('get-all-register-ventas', idSuc)
            .then(resp => setLista(JSON.parse(resp)))
            .catch(err => console.log(err))
    }
    //----------IMPRIMIR RECIBO-------------------------
    const imprimir = async (e) => {
        const data = {
            code: e.product_venta_code,
            sucursal_id: idSuc
        }
        await ipcRenderer.invoke('imprimir-recibo', data)
            .then(resp => {
                var response = JSON.parse(resp)
                if (response.status === 300) {
                    console.log(response.message)
                    return
                }
                // console.log(response.data.data)
                // setRecibo(response.data)
                //---------------------PDF GENERATE---------------------
                // const pdfGenerate = () => {
                    const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: [11, 7] })
                    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth()
                    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.height()

                    var image
                    var opts = {
                        errorCorrectionLevel: 'H',
                        type: 'image/jpeg',
                        quality: 0.3,
                        margin: 1,
                    }
                    QRCode.toDataURL(
                        `Empresa: XXX, Cliente: ${e.client_name} ${e.client_surname_p} ${e.client_surname_m}, CI: ${e.client_ci}, Total a Pagar: ${response.data.precio_venta}, cod: ${uuidv4()}`,
                        opts,
                        // { errorCorrectionLevel: 'H' },
                        function (err, url) { image = url })

                    var today = new Date();
                    doc.setFontSize(12)
                    //izquierda
                    doc.text(`Presupuesto N°`, 0.5, 0.5)
                    doc.setFontSize(10)
                    doc.text(`Fecha de Emision: ${today.toLocaleDateString()}`, 0.5, 0.8)
                    doc.setFontSize(8)
                    doc.text( `Cliente: ${e.client_name} ${e.client_surname_p} ${e.client_surname_m}`, 0.5, 1.1)
                    //derecha
                    doc.text(`Nombre de la Empresa`, 3.5, 0.5)
                    doc.text(`Documento no valido como factura`, 3.5, 0.8)
                    //QR
                    doc.addImage(`${image}`, 0.5, 1.3, 1.5, 1.5)
                    //Lista
                    doc.autoTable({
                        head: [[
                            { content: 'Producto', styles: { halign: 'center' } },
                            // { content: 'Tipo', styles: { halign: 'center' } },
                            { content: 'Cantidad', styles: { halign: 'center' } },
                            // { content: 'Precio', styles: { halign: 'center' } },
                        ]],
                        body: response.data.data.map((e, index) => ([
                            { content: e.product_name },
                            // { content: e.type_amount, styles: { halign: 'center' } },
                            { content: e.product_move_amount, styles: { halign: 'right' } },
                            // { content: e.price, styles: { halign: 'right' } },
                        ])),
                        foot: [[
                            { content: 'Total a Pagar', colSpan: 1 },
                            { content: response.data.precio_venta, styles: { halign: 'right' } }
                        ]],
                        startY: 1.3,
                        tableWidth: 4.3,
                        margin: { left: 2.2 }
                    })
                    doc.setFontSize(8)
                    doc.text(`Recibido:`, 2.2, doc.lastAutoTable.finalY + 0.3, 'left')
                    doc.text(`Firma:`, 4.2, doc.lastAutoTable.finalY + 0.3, 'left')
                    doc.text(`Aclaración:`, 4.2, doc.lastAutoTable.finalY + 0.5, 'left')


                    window.open(doc.output('bloburi'))

                // }
            })
            .catch(err => console.log(err))
    }
    // console.log(recibo)
    return (
        <Container maxWidth={false}>
            <Breadcrumbs className={classes.spacingBread}>
                <StyledBreadcrumb label="Realizar Venta" onClick={() => navigate(`/maindrawer/ventas/${id}`)} />
                <StyledBreadcrumb label="Registro de Ventas" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/maindrawer/lista-ventas/${id}`)} />
            </Breadcrumbs>
            <Container maxWidth='md'>
                {lista.length > 0 ? (
                    lista.map((e, index) => (
                        <Paper key={index} component={Box} p={1} m={1}>
                            <Grid container alignItems='center'>
                                <Grid item xs={12} sm={10} container direction='row'>
                                    <Typography variant='subtitle2' style={{ marginLeft: 10, marginRight: 10 }}> Cliente: {e.client_name} {e.client_surname_p} {e.client_surname_m}</Typography>
                                    <Typography variant='subtitle2' style={{ marginLeft: 10, marginRight: 10 }}> Carnet: {e.client_ci}</Typography>
                                    <Typography variant='subtitle2' style={{ marginLeft: 10, marginRight: 10 }}> Vendedor: {e.people_name}</Typography>
                                    <Typography variant='subtitle2' style={{ marginLeft: 10, marginRight: 10 }}> Fecha: {e.to_char}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Button onClick={() => imprimir(e)} size='small' variant='contained' endIcon={<PrintIcon />} style={{ background: '#1e88e5', color: 'white', textTransform: 'capitalize' }}>Imprimir Recibo</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))
                ) : (null)}
            </Container>
        </Container>
    )
}

const useStyles = makeStyles((theme) => ({
    spacingBread: {
        marginTop: 20,
        marginBottom: 20,
    },
    buttonSave: {
        background: '#43a047',
        color: 'white',
        marginBottom: 20,
    }
}))

