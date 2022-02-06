import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { 	Typography, 
 			Button,
 			Card, 
 			CardContent,
 			CssBaseline,
 			Grid,  
 			Container,
 			Paper,
 			FormControl,
 			FormControlLabel,
 			TextField,
 			AppBar,
 			Toolbar,
 			Snackbar	} from '@mui/material';

import MuiAlert from '@mui/material/Alert';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useClasses from '../../classes'
import styles from '../../styles';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login({ step, handleStep, token, setToken }) {


	useEffect(() => {
		if(token) {
			handleStep(1000);
		}
	}, [token])

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [username, setUsername] = React.useState('');
	let [password, setPassword] = React.useState('');

	const [openU, setOpenU] = React.useState(false);
	const [openP, setOpenP] = React.useState(false);

	function handleCloseU(event, reason) {
	    if (reason === 'clickaway') {
	      return;
	    }
		setOpenU(false);
	};
	function handleCloseP(event, reason) {
	    if (reason === 'clickaway') {
	      return;
	    }
		setOpenP(false);
	};

	function handleLogin() {
		Axios.post("https://mitsuki.qbmenu.ca/api/login", {
				username: username,
				password: password,
			})
			.then((response) => {
				switch (response.data.status) {
					case 1:
						setToken(response.data.token);
						handleStep(1000);
						return;
					case 2:
						setOpenP(true);
						return;
					case 3:
						setOpenU(true);
						return;
				}
				setUsername('');
				setPassword('');
			})
			.catch((e) => {
	       		console.log("error ", e)});
	}

	return (
		<>
		<CssBaseline />
		<main>
			<AppBar position="fixed">
			<Toolbar variant="dense">
				<Grid
					justifyContent="space-between"
					alignItems="center"
					container
				>
					<Grid item>
						<Typography variant="h6">
		  					Admin
		  				</Typography>
					</Grid>
	              </Grid>
			</Toolbar>
		</AppBar>
		<Snackbar open={openU} autoHideDuration={6000} onClose={handleCloseU}>
        <Alert onClose={handleCloseU} severity="error" sx={{ width: '100%' }}>
          Username doesn't exist.
        </Alert>
      </Snackbar>
      <Snackbar open={openP} autoHideDuration={6000} onClose={handleCloseP}>
        <Alert onClose={handleCloseP} severity="error" sx={{ width: '100%' }}>
          Password is invalid.
        </Alert>
      </Snackbar>

		<div className={classes.container}>
					<Container className={classes.loginCardGrid} maxWidth="sm">
					<Card className={classes.loginCard}>
						<CardContent className={classes.loginCardContent}>
							<form>
									<Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.loginFormContainer}>
										<Grid item>
											<Typography variant="h4">
												Login
											</Typography>
										</Grid>
										<Grid item>
											<TextField 
												id="username" 
												label="Username"
												onChange={(e) => {setUsername(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={username} 
											/>
										</Grid>
										<Grid item>
											<TextField 
												id="password" 
												label="Password"
												type="password"
												onChange={(e) => {setPassword(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={password} 
											/>
										</Grid>
										
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleLogin()} disabled={!username || !password}>
												Submit
											</Button>
										</Grid>
									</Grid>
								</form>
						</CardContent>

					</Card>
					</Container>
				</div>
		</main>
		</>
	)


}

export default Login;