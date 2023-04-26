import { Breadcrumbs, Button, Chip, Container, emphasize, Grid, InputLabel, makeStyles, MenuItem, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useContext, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Components/Atoms/AuthContext';

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

export default function IngresosEgresos() {
  const classes = useStyles()
  const navigate = useNavigate()
  const { idSuc } = useContext(AuthContext)
  const { id } = useParams()
  const descripcion = useRef()
  const motivo = useRef()
  const monto = useRef()
  const tipo_mov = useRef()

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

  const postIngresoEgreso = async (e) => {
    e.preventDefault()
    const data = {
      descripcion_mov: descripcion.current.value,
      motivo_mov: motivo.current.value,
      monto_mov: monto.current.value,
      tipo_mov: tipo_mov.current.value,
      sucursal_id: idSuc
    }
    // console.log(data)
    await ipcRenderer.invoke('post-ingreso-egreso-caja', data)
      .then(resp => {
        const response = JSON.parse(resp)
        if (response.status === 300) {
          Toast.fire({ icon: 'error', title: response.message })
          return
        }
        Toast.fire({ icon: 'success', title: response.message })
        e.target.reset()
      })
      .catch(err => Toast.fire({ icon: 'error', title: err }))

  }
  return (
    <Container>
      <Breadcrumbs className={classes.spacingBread}>
        <StyledBreadcrumb label="Ingreso de Productos" onClick={() => navigate(`/home/maindrawer/registro-producto/${id}`)} />
        <StyledBreadcrumb label="Movimiento Caja Chica" style={{ color: 'black', fontSize: 15 }} onClick={() => navigate(`/home/maindrawer/ingresos-egresos/${id}`)} />
      </Breadcrumbs>
      <Typography variant='h6' className={classes.inputText} align='center'>REGISTRAR MOVIMIENTO CAJA CHICA</Typography>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item xs={12} sm={5}>
          <form onSubmit={postIngresoEgreso}>
            <div className={classes.inputText}>
              <InputLabel className={classes.inputText} shrink>Descripción</InputLabel>
              <TextField
                style={{ background: 'white', borderRadius: 3 }}
                variant='outlined'
                size='small'
                fullWidth
                required
                defaultValue=""
                inputRef={descripcion}
              />
            </div>
            <div className={classes.inputText}>
              <InputLabel className={classes.inputText} shrink>Motivo</InputLabel>
              <TextField
                style={{ background: 'white', borderRadius: 3 }}
                variant='outlined'
                fullWidth
                size='small'
                required
                inputRef={motivo}
                inputProps={{ step: 'any' }}
              />
            </div>
            <div className={classes.inputText}>
              <InputLabel className={classes.inputText} shrink>Monto Bs.</InputLabel>
              <TextField
                style={{ background: 'white', borderRadius: 3 }}
                variant='outlined'
                fullWidth
                size='small'
                required
                inputRef={monto}
                type="number"
                inputProps={{ step: 'any' }}
                defaultValue='0'
              />
            </div>
            <div className={classes.inputText}>
              <InputLabel className={classes.inputText} shrink>Tipo de Movimiento</InputLabel>
              <TextField
                style={{ background: 'white', borderRadius: 3 }}
                variant='outlined'
                size='small'
                fullWidth
                select
                required
                defaultValue=""
                inputRef={tipo_mov}
              >
                <MenuItem value='3' >INGRESO</MenuItem>
                <MenuItem value='4'>EGRESO</MenuItem>
              </TextField>
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
  spacingBread: {
    marginTop: 20,
    marginBottom: 20,
  },

}))


