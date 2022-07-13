import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core'
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon from './icon';
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import jwt_decode from 'jwt-decode';
import {useDispatch} from 'react-redux'
import { useHistory } from 'react-router-dom';
import {signin, signup} from '../../actions/auth';


// import { useGoogleLogin } from '@react-oauth/google';
const initialState = {firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}
const Auth = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const classes = useStyles();
    const dispatch= useDispatch();
    const history = useHistory();
    const [formData, setFormData] = useState(initialState)

    // const state = null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value})
    }
    const switchMode = () => {
        setIsSignup((prev) => !prev)
        setShowPassword(false);
    }
    const googleSuccess = async (res) => {
        console.log(res);
        console.log('decoded', jwt_decode(res.credential));
        const decoded = jwt_decode(res.credential);
        const result = {name: decoded.name, picture: decoded.picture, email: decoded.email};
        const token = decoded.sub;

        try {
            dispatch({type: 'AUTH', data: {result, token}});
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }
    const googleFailure = (error) => {
        console.log("Google Sign In was unsuccessful. Try Again Later", error);
    }

    // const login = useGoogleLogin({
    // onSuccess: tokenResponse => console.log('success',tokenResponse),
    // });
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    {/* <Button className={classes.googleButton} color="primary" fullWidth onClick={login} startIcon={<Icon />} variant="contained">
                            Google Sign In
                        </Button> */}
                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onError={googleFailure}
                    />
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign up."}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth