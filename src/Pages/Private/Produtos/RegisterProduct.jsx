import { Button, Container, Grid, InputLabel, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { AuthContext } from '../../../Components/Atoms/AuthContext'

const ipcRenderer = window.require('electron').ipcRenderer


export default function RegisterProduct() {
    const classes = useStyles()
    const { idSuc } = useContext(AuthContext)
    const [product, setProduct] = useState([])
    const product_name = useRef()
    const product_amount = useRef()
    const product_price = useRef()


    useEffect(() => {
        getProducts()
    }, [])

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    //-----------GET PRODUCTS REFERENCES-------------------

    const getProducts = async () => {
        await ipcRenderer.invoke('get-all-products', idSuc)
            .then(resp => setProduct(JSON.parse(resp)))
            .catch(err => console.log(err))
    }

    //---------------POST PRODUCTS------------------------------
    const postProduct = async (e) => {
        e.preventDefault()
        const data = {
            product_id: product_name.current.value,
            product_move_amount: product_amount.current.value,
            product_move_price: product_price.current.value,
            move_id: 1,
            sucursal_id: idSuc
        }
        // console.log(data)
        await ipcRenderer.invoke('post-product-move-ingreso', data)
            .then(resp => {
                const response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                Toast.fire({ icon: 'success', title: response.message })
                e.target.reset()
            })
            .catch(err => console.log(err))
    }
    console.log(product)
    return (
        <Container>
            <Typography variant='h5' className={classes.inputText} align='center'>REGISTRAR NUEVO PRODUCTO</Typography>
            <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12} sm={5}>
                    <form onSubmit={postProduct}>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Nombre de Producto</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 3 }}
                                variant='outlined'
                                size='small'
                                fullWidth
                                select
                                required
                                defaultValue=""
                                inputRef={product_name}
                            >
                                {product.map((e, index) => (
                                    <MenuItem key={index} value={`${e.product_id}`} >{e.product_name}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Cantidad</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 3 }}
                                variant='outlined'
                                fullWidth
                                size='small'
                                required
                                inputRef={product_amount}
                                type="number"
                                inputProps={{ step: 'any' }}
                            />
                        </div>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Precio</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 3 }}
                                fullWidth
                                variant='outlined'
                                size='small'
                                required
                                inputRef={product_price}
                                type="number"
                                inputProps={{ step: 'any' }}

                            />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Button type='submit' variant='contained' style={{ background: '#43a047', color: 'white' }} fullWidth>Guardar</Button>
                        </div>
                    </form>
                </Grid>
            </Grid>
        </Container>
    )
}

const useStyles = makeStyles((theme) => ({
    inputText: {
        marginTop: 10,
        marginBottom: 10
    },

}))

