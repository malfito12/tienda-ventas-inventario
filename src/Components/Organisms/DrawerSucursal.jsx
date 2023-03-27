import React, { useContext, useState } from 'react';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { AppBar, CssBaseline, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Menu, MenuItem } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ListViewUser from '../../Pages/Private/Usuarios/ListViewUser';
import Home from '../../Pages/Private/Home';
import AddSucursal from '../../Pages/Private/Sucursales/AddSucursal';
import ViewSucursal from '../../Pages/Private/Sucursales/ViewSucursal';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { AuthContext } from '../Atoms/AuthContext';
import MainAppBar from '../Molecules/MainAppBar';


const drawerWidth = 240;

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
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function DrawerSucursal(props) {
    const {logout}=useContext(AuthContext)
    const navigate = useNavigate()
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const drawer = (
        <div>
            <MainAppBar />
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {/* {sucursales.length>0 && sucursales.map((e, index) => (
                    <ListItem key={index} button onClick={() => navigate(`/sucursal/${e.sucursal_id}`)}>
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={e.sucursal_name} />
                    </ListItem>

                ))} */}
                
                <ListItem button>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Balance General' />
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <div className={classes.root}>
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
                    <Hidden xsDown implementation="css">
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
                        <Route path='/home' element={<Home />} />
                        <Route path='/lista-usuarios' element={<ListViewUser />} />
                        <Route path='/registro-sucursal' element={<AddSucursal />} />
                        <Route path='/sucursal/:id' element={<ViewSucursal />} />

                    </Routes>
                </main>
            </div>
        </>
    );
}


export default DrawerSucursal;
