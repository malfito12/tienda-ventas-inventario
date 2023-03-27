import { Button, Container, Grid, InputLabel, MenuItem, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2';
import MainAppBar from '../../../Components/Molecules/MainAppBar';
const ipcRenderer = window.require('electron').ipcRenderer


const AddSucursal = () => {
    const classes = useStyles()
    const [dataDep, setDataDep] = useState('')
    const name_sucursal = useRef()
    const address_sucursal = useRef()
    const dep_sucursal = useRef()
    const phone_sucursal = useRef()
    const [mobileOpen, setMobileOpen] = useState(false);
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

    // -----------------------POST SUCURSAL---------------------------
    const postSucursal = async (e) => {
        e.preventDefault()
        const data = {
            name_sucursal: name_sucursal.current.value,
            address_sucursal: address_sucursal.current.value,
            dep_sucursal: dep_sucursal.current.value,
            phone_sucursal: phone_sucursal.current.value,
            user_id: sessionStorage.getItem('user')
        }
        try {
            await ipcRenderer.invoke('add-sucursal', data)
                .then(resp => {
                    const response = JSON.parse(resp)
                    if (response.status === 300) {
                        Swal.fire('Error', response.message, 'error')
                        return
                    }
                    Swal.fire('Success', response.message, 'success')
                    e.target.reset()
                })
        } catch (error) {
            Swal.fire('Error', error, 'error')
            console.log(error)
        }
        // console.log(data)
    }
    const handleChangeDep = (e) => {
        setDataDep(e.target.value)
    }

    return (
        <>
            <MainAppBar menu={handleDrawerToggle} />
            <div className={classes.toolbar} />
            <Container fixed>
                <div className={classes.form}>

                    <Typography variant='h5' className={classes.inputText}>NUEVA SUCURSAL</Typography>
                    <Grid container justifyContent='center' alignItems='center'>
                        <Grid item xs={12} sm={5}>
                            <form onSubmit={postSucursal}>
                                <div className={classes.inputText}>
                                    <InputLabel className={classes.inputText} shrink>Nombre Sucursal</InputLabel>
                                    <TextField
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        required
                                        inputRef={name_sucursal}
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
                                    />
                                </div>
                                <div className={classes.inputText}>
                                    <InputLabel className={classes.inputText} shrink>Departamento</InputLabel>
                                    <TextField
                                        value={dataDep}
                                        select
                                        onChange={handleChangeDep}
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        inputRef={dep_sucursal}
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
                                    />
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <Button type='submit' variant='contained' style={{ background: '#43a047', color: 'white' }} fullWidth>Guardar</Button>
                                </div>
                            </form>
                        </Grid>
                    </Grid>
                </div>

            </Container >
        </>
    )
}

export default AddSucursal

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
