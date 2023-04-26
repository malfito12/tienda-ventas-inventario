import { AppBar, CssBaseline, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useContext, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../Atoms/AuthContext';
const drawerWidth = 60;
const MainAppBar = (props) => {
    let location = useLocation()
    const classes = useStyles()
    const { logout,secondLoguot } = useContext(AuthContext)
    const [openDrop, setOpenDrop] = useState(null)

    const handleDrawerToggle = () => {
        props.menu()
    };
    // ---------------------OPEN DROPDOWN-----------------------
    const openDropDown = (e) => {
        setOpenDrop(e.currentTarget)
    }
    const closeDropDown = () => {
        setOpenDrop(null)
    }
    const cerrarSesion = () => {
        secondLoguot()
        // logout()
        closeDropDown()

    }
    return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={
                    location.pathname === '/home'
                        ? null
                        : location.pathname === '/home/registro-sucursal'
                            ? null
                            : classes.appBar
                }
                style={{ background: '#263238', color: 'white' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <NavLink style={{ textDecoration: 'none', color: 'white' }} to='/home'>
                        <Typography variant="h6" noWrap>Sucursales</Typography>
                    </NavLink>
                    <div style={{ flexGrow: 1}} />
                    <Typography>{window.sessionStorage.getItem('user_name')}</Typography>
                    <IconButton style={{color:'white'}} onClick={openDropDown}>
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* --------------------------------MENU PERFIL---------------------------- */}
            <Menu
                getContentAnchorEl={null}
                anchorEl={openDrop}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={Boolean(openDrop)}
                onClose={closeDropDown}
            >
                <MenuItem onClick={closeDropDown}>Mi Perfil</MenuItem>
                <MenuItem onClick={cerrarSesion}>Cerrar Sesion</MenuItem>
            </Menu>
        </>
    )
}

export default MainAppBar
const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    appBarTow: {
        marginTop: 20
    }
}))