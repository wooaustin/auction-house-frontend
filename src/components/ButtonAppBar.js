import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth0 } from "../react-auth0-spa";
import { inject } from 'mobx-react';

const useStyles = makeStyles((theme) => ({
    
    title: {
        flexGrow: 1,
    },
    button: {
        color: 'white',
    },
    loginLogoutContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexBasis: '50%',
    },
    menuOptionsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexBasis: '50%',
    },
    navbar: {
        background: 'linear-gradient(90deg, rgba(190,52,32,1) 0%, rgba(231,75,77,1) 48%, rgba(231,148,74,1) 100%)',
        padding: 14,
        marginBottom: 24,
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box',
    }
}));


const ButtonAppBar = (props) => {
    const {authStore, routerHistory} = props;
    const auth0 = useAuth0();
    const { loginWithRedirect, logout } = auth0;
    const isAuthenticated = authStore.token;
    const classes = useStyles();

    return (
        <div className="navbarContainer">
            <AppBar className={classes.navbar} position='static'>
                <Toolbar>
                    <Typography>
                        <div>
                            <Button className={classes.button} onClick={()=> routerHistory.push('/')}
                            > Home </Button>
                            {isAuthenticated && (
                                <Button
                                className={classes.button}
                                onClick={()=>routerHistory.push("/auctions")}
                                >
                                Find Auctions
                                </Button>
                            )}
                            {isAuthenticated && (
                                <Button 
                                className={classes.button}
                                onClick={()=>routerHistory.push("/myauctions")}
                                >
                                 My Auctions
                                </Button>
                            )}
                            {isAuthenticated && (
                                <Button 
                                className={classes.button}
                                onClick={()=>routerHistory.push('/mybids')}
                                > 
                                My Bids
                                </Button>
                            )}
                            <Button className={classes.button} onClick={()=>routerHistory.push('/about')}> About Us</Button>
                            {!isAuthenticated && (
                                <Button
                                className={classes.button}
                                onClick={() => loginWithRedirect({})}
                                >
                                Sign in
                                </Button>
                             )}

                            {isAuthenticated && (
                                <Button
                                className={classes.button}
                                onClick={() => logout({})}
                                >
                                Sign out
                                </Button>
                                )}
                        </div>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default inject("authStore", "routerHistory")(ButtonAppBar);