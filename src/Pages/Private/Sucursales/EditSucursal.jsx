import { Button, CircularProgress, Container, Grid, InputLabel, MenuItem, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';
import MainAppBar from '../../../Components/Molecules/MainAppBar';
import { AuthContext } from '../../../Components/Atoms/AuthContext';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
const ipcRenderer = window.require('electron').ipcRenderer

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

const EditSucursal = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const { idSuc } = useContext(AuthContext)
    const name_sucursal = useRef()
    const address_sucursal = useRef()
    const dep_sucursal = useRef()
    const phone_sucursal = useRef()
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [sucursal, setSucursal] = useState(false)
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const dep = [
        { id: 1, name: 'Beni' },
        { id: 2, name: 'Cochabamba' },
        { id: 3, name: 'Chuquisaca' },
        { id: 4, name: 'La Paz' },
        { id: 5, name: 'Oruro' },
        { id: 6, name: 'Pando' },
        { id: 7, name: 'Potosi' },
        { id: 8, name: 'Santa Cruz' },
        { id: 9, name: 'Tarija' },
    ]

    useEffect(() => {
        getSucursal()
    }, [])

    const getSucursal = async () => {
        // console.log(idSuc)
        setLoading(true)
        await ipcRenderer.invoke('get-sucursal', idSuc)
            .then(resp => setSucursal(JSON.parse(resp)))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    // -----------------------POST SUCURSAL---------------------------
    const editSucursal = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            name_sucursal: name_sucursal.current.value,
            address_sucursal: address_sucursal.current.value,
            dep_sucursal: dep_sucursal.current.value,
            phone_sucursal: phone_sucursal.current.value,
            user_id: sessionStorage.getItem('user'),
            sucursal_id: idSuc
        }
        // console.log(data)
        await ipcRenderer.invoke('edit-sucursal', data)
            .then(resp => {
                const response = JSON.parse(resp)
                if (response.status === 300) {
                    Toast.fire({ icon: 'error', title: response.message })
                    return
                }
                navigate('/home')
                Toast.fire({ icon: 'success', title: response.message })
                e.target.reset()
            })
            .catch(err => Toast.fire({ icon: 'error', title: err }))
            .finally(() => setLoading(false))
    }

    //-----------------------DELETE----------------------------
    
    const deleteSucursal=async(e)=>{
        e.preventDefault()
        Swal.fire({
            title: 'Estas Seguro de Eliminar?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            text: "La Sucursal se Eliminará por completo!!",
            icon: 'warning',
        }).then(async resp => {
            if (resp.isConfirmed) {
                Swal.showLoading()
                await ipcRenderer.invoke('delete-sucursal', idSuc)
                    .then(resp => {
                        const response = JSON.parse(resp)
                        if (response.status === 300) {
                            Toast.fire({ icon: 'error', title: response.message })
                            return
                        }
                        navigate('/home')
                        Toast.fire({ icon: 'success', title: response.message })
                    })
                    .catch(err => Toast.fire({ icon: 'success', title: err }))
            }
        })
    }

    return (
        <div className='otro'>
            <MainAppBar menu={handleDrawerToggle} />
            <div className={classes.toolbar} />
            <Container fixed>
                <div className={classes.form}>

                    <Typography variant='h5' className={classes.inputText} style={{ color: '#e0e0e0' }}>NUEVA SUCURSAL</Typography>
                    <Grid container justifyContent='center' alignItems='center'>
                        <Grid item xs={12} sm={5}>
                            {sucursal.length > 0 ? (
                                <>
                                    <form onSubmit={editSucursal}>
                                        <div className={classes.inputText}>
                                            <InputLabel className={classes.inputText} shrink>Nombre Sucursal</InputLabel>
                                            <TextField
                                                variant='outlined'
                                                fullWidth
                                                size='small'
                                                required
                                                inputRef={name_sucursal}
                                                defaultValue={sucursal[0].sucursal_name}
                                                style={{ background: 'white', borderRadius: 5 }}
                                            />
                                        </div>
                                        <div className={classes.inputText}>
                                            <InputLabel className={classes.inputText} shrink>Dirección</InputLabel>
                                            <TextField
                                                variant='outlined'
                                                fullWidth
                                                size='small'
                                                required
                                                inputRef={address_sucursal}
                                                defaultValue={sucursal[0].sucursal_address}
                                                style={{ background: 'white', borderRadius: 5 }}
                                            />
                                        </div>
                                        <div className={classes.inputText}>
                                            <InputLabel className={classes.inputText} shrink>Departamento</InputLabel>
                                            <TextField
                                                // value={dataDep}
                                                select
                                                // onChange={handleChangeDep}
                                                fullWidth
                                                variant='outlined'
                                                size='small'
                                                inputRef={dep_sucursal}
                                                defaultValue={sucursal[0].sucursal_dep}
                                                style={{ background: 'white', borderRadius: 5 }}
                                                required
                                            >
                                                {dep.map((e, index) => (<MenuItem key={index} value={e.name}>{e.name}</MenuItem>))}
                                            </TextField>
                                        </div>
                                        <div className={classes.inputText}>
                                            <InputLabel className={classes.inputText} shrink>Telefono</InputLabel>
                                            <TextField
                                                variant='outlined'
                                                fullWidth
                                                size='small'
                                                required
                                                inputRef={phone_sucursal}
                                                defaultValue={sucursal[0].sucursal_phone}
                                                style={{ background: 'white', borderRadius: 5 }}
                                            />
                                        </div>
                                        <div style={{ marginTop: 20 }}>
                                            <Button endIcon={<SaveIcon />} disabled={loading} type='submit' variant='contained' style={{ background: '#43a047', color: 'white', textTransform: 'capitalize' }} fullWidth>{loading ? <CircularProgress style={{ width: 27, height: 27 }} /> : 'Guardar'}</Button>
                                        </div>
                                    </form>
                                    <div style={{ marginTop: 20 }}>
                                        <Button endIcon={<DeleteIcon />} disabled={loading} onClick={deleteSucursal} variant='contained' style={{ background: 'red', color: 'white', textTransform: 'capitalize' }} fullWidth>{loading ? <CircularProgress style={{ width: 27, height: 27 }} /> : 'Borrar'}</Button>
                                    </div>
                                </>
                            ) : null}
                        </Grid>
                    </Grid>
                </div>

            </Container >
        </div>
    )
}

export default EditSucursal

const useStyles = makeStyles((theme) => ({
    inputText: {
        marginTop: 10,
        marginBottom: 10
    },
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '70vh',
    },
    toolbar: theme.mixins.toolbar,
}))
