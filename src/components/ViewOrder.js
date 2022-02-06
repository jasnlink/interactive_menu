import React, { useState, useEffect } from 'react';
import Axios from 'axios';


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
 			List,
 			ListItem,
 			Chip,
 			Divider,
 			Fab	   } from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useClasses from '../classes'
import styles from '../styles';


function ViewOrder({ handleStep, cartToken, setCartToken }) {

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);


	let [orderList, setOrderList] = React.useState([]);
	let [isOrderListLoading, setIsOrderListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/order", {
			cartToken: cartToken,
		})
		.then((response) => {
			setOrderList(response.data);
			setIsOrderListLoading(false);
			console.log(response.data);
		})
		.catch((e) => {
       		console.log("error ", e);
       	});
	}, []);

	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState("");
	//Update cart count and subtotal
	useEffect(()=> {

		if (orderList.length === 0) {
			setCartCount("");
			setCartSubtotal(0);
			return;
		}
		//inital value so no errors are thrown
		let initialValue = 0;
		//sum up all cart quantities
		let tempCartCount = orderList.reduce(function (previousValue, currentValue) {
		    return previousValue + currentValue.quantity
		}, initialValue)

		let tempCartSubtotal = orderList.reduce(function (previousValue, currentValue) {
			let currentTotal = currentValue.quantity*currentValue.item_price;
			return previousValue + currentTotal;
		}, initialValue)

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2);

		setCartCount(tempCartCount);
		setCartSubtotal(tempCartSubtotal);

	}, [orderList]);

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
			<Container maxWidth="xs" className={classes.viewOrderContainer}>
				<Paper elevation={1}>
					<List>
						<ListItem>							
							<Grid container alignItems="center" direction="row" justifyContent="space-between">
								<Grid item xs={9}>
									<Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
										<Grid item>
											<Typography variant="subtitle1" color="textPrimary">
												Qté
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1" color="textPrimary">
												&nbsp;Article
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={3}>
									<Grid container justifyContent="flex-end">
										<Typography variant="subtitle1" color="textPrimary">
										Prix
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</ListItem>
						<Divider />
						{orderList.map((item, index) => (
						<ListItem key={index}>							
							<Grid container alignItems="center" direction="row" justifyContent="space-between">
								<Grid item xs={9}>
									<Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
										<Grid item>
											<Chip label={item.quantity} />
										</Grid>
										<Grid item>
											<Typography variant="subtitle2" color="textPrimary">
											{item.item_name}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={3}>
									<Grid container justifyContent="flex-end">
										<Typography variant="subtitle1" color="textPrimary">
											{item.item_price}$
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</ListItem>
						))}
						<Divider />
						<ListItem>
							<Grid container alignItems="center" justifyContent="space-between">
								<Grid item xs={9}>
									<Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
										<Grid item>
											<Chip label={cartCount} />
										</Grid>
										<Grid item>
											<Typography className={classes.cartSubtotalText} variant="subtitle1" color="textPrimary">
												Sous-total
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={3}>
									<Grid container justifyContent="flex-end">
										<Typography className={classes.cartSubtotalText} variant="subtitle1" color="textPrimary">
											{cartSubtotal}$
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							
						</ListItem>
					</List>
				</Paper>	
			</Container>
		</main>
		</>
	)


}

export default ViewOrder;