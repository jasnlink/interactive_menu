import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import QRCode from 'qrcode';

import { 	Typography, 
 			CssBaseline, 
 			Grid,  
 			Container,
 			AppBar,
 			Toolbar,
 			ImageList,
 			ImageListItem,
 			ImageListItemBar,
 			ButtonBase,
 			Paper,
 			Button,
 			Drawer,
 			List,
 			ListItem,
 			Divider,
 			Chip	   } from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useClasses from '../classes'
import styles from '../styles';


function ProcessOrder({ handleStep, cart, setCart, cartToken, setCartToken }) {

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	function handleBackHome() {
		setCartToken(null);
		setCart([]);
		handleStep(1);
	}

	let [qrCode, setQrCode] = React.useState("");
	useEffect(()=> {
		const qrLink = "https://mitsuki.qbmenu.ca/order/"+cartToken;
		QRCode.toDataURL(qrLink, { errorCorrectionLevel: 'H', width: 1000 })
		.then(url => {
		    setQrCode(url);
		  })
		  .catch(err => {
		    console.error(err)
		  })
	}, []);
	
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	//Update order subtotal
	useEffect(()=> {

		//inital value so no errors are thrown
		let initialValue = 0;

		let tempCartSubtotal = cart.reduce(function (previousValue, currentValue) {
			let currentTotal = currentValue.itemQty*currentValue.itemPrice;
			return previousValue + currentTotal;
		}, initialValue)

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2);

		setCartSubtotal(tempCartSubtotal);

	}, []);	

	const [drawerOpen, setDrawerOpen] = React.useState(false);
	//Toggle drawer open/close state
	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	}


	return (
		<>
		<CssBaseline />
		<main>
			<AppBar position="static">
				<Toolbar variant="dense">
					<Grid
						justifyContent="flex-start"
						alignItems="center"
						container
						spacing={2}
					>
						<Grid item>
							<Typography variant="h6">
			  					Menu
			  				</Typography>
						</Grid>
		              </Grid>
				</Toolbar>
			</AppBar>
			<Container maxWidth="xs" className={classes.processOrderContainer}>
				<Paper elevation={1}>
					<Grid container className={classes.orderQrContainer} direction="column" spacing={2} maxWidth="xs" justifyContent="center" alignItems="center">
						
						<Grid item>
							<img 

								className={classes.orderQrImg}
								src={qrCode}
							/>
						</Grid>
						<Grid item>
							<Typography variant="h5">
								Présentez le code au comptoir.
							</Typography>
						</Grid>
						<div className={classes.orderQrButtonTopDiv}>
							<Button variant="outlined" size="large" color="primary" className={classes.orderQrButtonTop} onClick={toggleDrawer}>
								Voir la commande
							</Button>
						</div>
						<div className={classes.orderQrButtonBotDiv}>
							<Button variant="contained" size="large" color="primary" className={classes.orderQrButtonBot} onClick={() => handleBackHome()}>
								Retour à l'accueil
							</Button>
						</div>
					</Grid>	
				</Paper>
				<div className={classes.cartDrawerDiv}>
	      	<Drawer classes={{ paper: classes.cartDrawer, }} anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
	      		
	      		<List>
	      			<ListItem>
	      				<Grid container alignItems="center" justifyContent="center">
		      				<Typography variant="h6" color="textPrimary">
								Votre Commande
							</Typography>
						</Grid>
	      			</ListItem>
	      			<Divider />
				{cart.map((item, index) => (
					<ListItem key={index}>
						
						<Grid container alignItems="center" direction="row" justifyContent="space-between">
							<Grid item xs={9}>
								<Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
									<Grid item>
										<Chip label={item.itemQty} />
									</Grid>
									<Grid item>
										<Typography variant="subtitle2" color="textPrimary">
										{item.itemName}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={3}>
								<Grid container justifyContent="flex-end">
									<Typography variant="subtitle1" color="textPrimary">
										{item.itemPrice}$
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</ListItem>
				))}
					<Divider />
					<ListItem>
						<Grid container alignItems="center" justifyContent="space-between">
							<Grid item>
								<Typography className={classes.cartSubtotalText} variant="subtitle1" color="textPrimary">
									Sous-total
								</Typography>
							</Grid>
							<Grid item>
								<Typography className={classes.cartSubtotalText} variant="subtitle1" color="textPrimary">
									{cartSubtotal}$
								</Typography>
							</Grid>
						</Grid>
						
					</ListItem>
				</List>
				
	      	</Drawer>
	      	</div>	
			</Container>
		</main>
		</>
	)


}

export default ProcessOrder;