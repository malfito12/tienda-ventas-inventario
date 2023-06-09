import { Breadcrumbs, Button, Chip, CircularProgress, Container, emphasize, Grid, InputLabel, makeStyles, MenuItem, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { AuthContext } from '../../../Components/Atoms/AuthContext'
import SaveIcon from '@material-ui/icons/Save';

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

export default function RegisterProduct() {
    const classes = useStyles()
    const navigate=useNavigate()
    const {id}=useParams()
    const { idSuc } = useContext(AuthContext)
    const [product, setProduct] = useState([])
    const [typeProduct, setTypeProduct] = useState([])
    const [loading,setLoading]=useState(false)
    const product_type = useRef()
    const product_name = useRef()
    const product_amount = useRef()
    const product_amount_unit = useRef()
    const product_price = useRef()


    useEffect(() => {
        getTypeProducts()
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
    //-----------GET TYPE PRODUCTS REFERENCES-------------------
    const getTypeProducts=async()=>{
        await ipcRenderer.invoke('get-all-type-product',idSuc)
        .then(resp=>setTypeProduct(JSON.parse(resp)))
        .catch(err=>console.log(err))
    }
    //-----------GET PRODUCTS REFERENCES-------------------
    
    const getProducts = async (id) => {
        console.log(id)
        const data={
            type_id:id,
            idSuc:idSuc
        }
        await ipcRenderer.invoke('get-specific-products', data)
            .then(resp => setProduct(JSON.parse(resp)))
            .catch(err => console.log(err))
    }

    //---------------POST PRODUCTS------------------------------
    const postProduct = async (e) => {
        e.preventDefault()
        const data = {
            product_id: product_name.current.value,
            product_move_amount: product_amount.current.value,
            product_move_amount_unit: product_amount_unit.current.value,
            product_move_price: product_price.current.value,
            move_id: 1,
            sucursal_id: idSuc
        }
        // console.log(data)
        setLoading(true)
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
            .finally(()=>setLoading(false))
    }
    // console.log(product)
    const handleChangeTypeProduct=(e)=>{
        const id=e.target.value
        // console.log(id)
        getProducts(id)
    }
    return (
        <Container>
            <Breadcrumbs >
                <StyledBreadcrumb label="Ingreso de Productos" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/registro-producto/${id}`)} />
                <StyledBreadcrumb label="Movimiento Caja Chica"  onClick={() => navigate(`/home/maindrawer/ingresos-egresos/${id}`)} />
            </Breadcrumbs>
            <Typography variant='h6' className={classes.inputText} style={{color:'#e0e0e0'}} align='center'>REGISTRAR INGRESOS DE PRODUCTOS</Typography>
            <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12} sm={5}>
                    <form onSubmit={postProduct}>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Tipo de Producto</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 5 }}
                                variant='outlined'
                                size='small'
                                fullWidth
                                select
                                required
                                defaultValue=""
                                inputRef={product_type}
                                onChange={handleChangeTypeProduct}
                            >
                                {typeProduct.map((e, index) => (
                                    <MenuItem key={index} value={`${e.type_id}`} >{e.type_name}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Nombre de Producto</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 5 }}
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
                            <InputLabel className={classes.inputText} shrink>Cantidad Cajas</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 5 }}
                                variant='outlined'
                                fullWidth
                                size='small'
                                required
                                inputRef={product_amount}
                                type="number"
                                inputProps={{ step: 'any' }}
                                defaultValue='0'
                            />
                        </div>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Cantidad Unidades</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 5 }}
                                variant='outlined'
                                fullWidth
                                size='small'
                                required
                                inputRef={product_amount_unit}
                                type="number"
                                inputProps={{ step: 'any' }}
                                defaultValue='0'
                            />
                        </div>
                        <div className={classes.inputText}>
                            <InputLabel className={classes.inputText} shrink>Precio</InputLabel>
                            <TextField
                                style={{ background: 'white', borderRadius: 5 }}
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
                            <Button disabled={loading} endIcon={<SaveIcon/>} type='submit' variant='contained' style={{ background: '#43a047', color: 'white',textTransform:'capitalize' }} fullWidth>{loading?<CircularProgress style={{width:25,height:25}}/>:'Guardar'}</Button>
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
    spacingBread: {
        marginTop: 20,
        marginBottom: 20,
      },

}))

