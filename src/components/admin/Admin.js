import React, { useEffect } from 'react';
import Axios from 'axios';

import { 	Typography, 
 			Button,
 			Chip, 
 			Card, 
 			CardContent,
 			CssBaseline,
 			Divider, 
 			Grid,  
 			Container,
 			Paper,
 			List,
 			ListItem,
 			ListItemText,
 			AppBar,
 			Toolbar,
 			Snackbar	} from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useClasses from '../../classes'
import styles from '../../styles';


function Admin({ handleStep, token, setToken }) {

	useEffect(() => {
		if(!token) {
			handleStep(999);
		}
	}, [token])

	let [cartDisabled, setCartDisabled] = React.useState(0);
	//fetch config list
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/admin/config")
		.then((response) => {
			setCartDisabled(response.data[0].cart_disabled);
		})
		.catch((e) => {
       		console.log("error ", e);
       	});
	}, []);

	//handle cart toggle
	function handleCartToggle() {

		let tempCartDisabled = cartDisabled;
		tempCartDisabled = tempCartDisabled === 0 ? 1 : 0;


		Axios.post("https://mitsuki.qbmenu.ca/api/toggle/admin/cart", {
			cartDisabled: tempCartDisabled,
		})
		.then((response) => {
			setCartDisabled(response.data[0].cart_disabled);
		})
		.catch((e) => {
       		console.log("error ", e);
       	});
	}

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	function handleLogOut() {
		setToken(null);
		handleStep(1);
		return;
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

		<div className={classes.container}>
					<Container className={classes.loginCardGrid} maxWidth="sm">
					<Card className={classes.loginCard}>
						<CardContent className={classes.loginCardContent}>
							<List>
								<ListItem>
									<Typography variant="h5" color="textPrimary" align="center">
										Menu Manager
									</Typography>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleStep(1003)}>
									<ListItemText primary="Edit Menu Main Categories" />
								</ListItem>
								<ListItem button onClick={() => handleStep(1001)}>
									<ListItemText primary="Edit Menu Categories" />
								</ListItem>
								<ListItem button onClick={() => handleStep(1002)}>
									<ListItemText primary="Edit Menu Items" />
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleCartToggle()}>
									<ListItemText primary={cartDisabled === 1 ? "Enable Cart System" : "Disable Cart System"} />
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleLogOut()}>
									<ListItemText primary="Log Out" />
								</ListItem>		
							</List>
						</CardContent>

					</Card>
					</Container>
				</div>
		</main>
		</>
	)


}

export default Admin;