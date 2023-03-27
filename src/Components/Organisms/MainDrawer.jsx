import React, { useContext } from 'react';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ListViewUser from '../../Pages/Private/Usuarios/ListViewUser';
import ViewSucursal from '../../Pages/Private/Sucursales/ViewSucursal';
import { AuthContext } from '../Atoms/AuthContext';
import MainAppBar from '../Molecules/MainAppBar';
import ListViewProduct from '../../Pages/Private/Almacenes/ListViewProduct';
import ListViewTypeProduct from '../../Pages/Private/Almacenes/ListViewTypeProduct';
import ListViewUnidadMedida from '../../Pages/Private/Almacenes/ListViewUnidadMedida';
import { VentaProducts } from '../../Pages/Private/Ventas/VentaProducts';
import KardexProducto from '../../Pages/Private/Kardexs/KardexProducto';
import RegisterProduct from '../../Pages/Private/Produtos/RegisterProduct';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import StoreIcon from '@material-ui/icons/Store';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import { ListViewClients } from '../../Pages/Private/Clientes/ListViewClients';
import CierreCaja from '../../Pages/Private/Cajas/CierreCaja';

const drawerWidth = 60;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    // appBar: {
    //     zIndex: theme.zIndex.drawer + 1,
    //   },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        background: '#263238'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function MainDrawer(props) {

    const { idSuc } = useContext(AuthContext)
    const navigate = useNavigate()
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const drawer = (
        <div >
            <div className={classes.toolbar} />
            <Divider />
            <List>
                <ListItem button onClick={() => navigate(`/maindrawer/usuarios/${idSuc}`)}>
                    {/* <ListItemIcon style={{color:'white'}}> */}
                    <Tooltip title='Usuarios'>
                        <PersonSharpIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Almacen' /> */}
                </ListItem>
                <ListItem button onClick={() => navigate(`/maindrawer/almacen/${idSuc}`)}>
                    {/* <ListItemIcon style={{color:'white'}}> */}
                    <Tooltip title='Almacén'>
                        <StoreIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Almacen' /> */}
                </ListItem>
                <ListItem button onClick={() => navigate(`/maindrawer/ventas/${idSuc}`)}>
                    {/* <ListItemIcon> */}
                    <Tooltip title='Venta de productos'>
                        <LocalGroceryStoreIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Ventas' style={{color:'white'}} /> */}
                </ListItem>
                <ListItem button onClick={() => navigate(`/maindrawer/registro-producto/${idSuc}`)}>
                    {/* <ListItemIcon style={{color:'white'}}> */}
                    <Tooltip title='Registro de Productos'>
                        <AddBoxIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Registro de Productos' /> */}
                </ListItem>
                <ListItem button onClick={() => navigate(`/maindrawer/clientes/${idSuc}`)}>
                    {/* <ListItemIcon style={{color:'white'}}> */}
                    <Tooltip title='Clientes'>
                        <NaturePeopleIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Perfil Sucursal' /> */}
                </ListItem>
                <ListItem button onClick={()=>navigate(`/maindrawer/cierre-caja/${idSuc}`)}>
                    {/* <ListItemIcon style={{color:'white'}}> */}
                    <Tooltip title='Cierre de Caja'>
                        <CheckBoxIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Cierre de Caja' /> */}
                </ListItem>
                <ListItem button>
                    {/* <ListItemIcon style={{color:'white'}}> */}
                    <Tooltip title='Balances'>
                        <AccountBalanceIcon style={{ color: 'white', marginBottom: 10 }} />
                    </Tooltip>
                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary='Balances' /> */}
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <div className={classes.root} >
                <MainAppBar menu={handleDrawerToggle} />
                <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css" >
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Routes>
                        <Route path='/sucursal/:id' element={<ViewSucursal />} />
                        <Route path='/usuarios/:id' element={<ListViewUser />} />
                        <Route path='/almacen/:id' element={<ListViewProduct />} />
                        <Route path='/tipo-producto/:id' element={<ListViewTypeProduct />} />
                        <Route path='/unidad-medida/:id' element={<ListViewUnidadMedida />} />
                        <Route path='/ventas/:id' element={<VentaProducts />} />
                        <Route path='/kardex-producto/:id' element={<KardexProducto />} />
                        <Route path='/registro-producto/:id' element={<RegisterProduct />} />
                        <Route path='/clientes/:id' element={<ListViewClients />} />
                        <Route path='/cierre-caja/:id' element={<CierreCaja />} />
                    </Routes>
                </main>
            </div>

        </>
    );
}


export default MainDrawer;
