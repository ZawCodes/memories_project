import React, {useState, useEffect} from 'react'
import { AppBar, Typography, Toolbar, Button, Avatar} from '@material-ui/core';
import useStyles from './styles';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';
import {Link, useHistory, useLocation} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    // console.log(user);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(()=>{
        const token = user?.token;

        if(token?.length > 100) {
            const decodedToken = decode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    const logout = () => {
        dispatch({type: 'LOGOUT'});
        history.push('/');
        setUser(null);
    }
  return (
      <AppBar className={classes.appBar} position="static" color="inherit">
          <Link to="/" className={classes.brandContainer}>
              <img src={memoriesText} alt="icon" height="45px" />
              <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
          </Link>
          <Toolbar className={classes.toolbar}>
            {user ? (
                <div className={classes.profile}>
                    <Avatar className={classes.purple} alt={user.result.name} src={user.result.profile}>{user.result.name.charAt(0)}</Avatar>
                    <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
                    <Button variant="contained" className={classes.logout} onClick={logout} color="secondary">Logout</Button>
                </div>
            ): (
                <Button component={Link} to="/auth" variant="contained" color="primary">Sign in</Button>
            )}
          </Toolbar>
      </AppBar>
  )
}

export default Navbar