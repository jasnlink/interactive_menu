import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { 	Typography, 
 			Button,
 			CssBaseline,
 			Divider, 
 			Grid,  
 			Container,
 			IconButton,
 			AppBar,
 			Toolbar,
 			Accordion,
 			AccordionSummary,
 			AccordionDetails,
 			Dialog,
 			DialogTitle,
 			DialogContent,
 			DialogContentText,
 			DialogActions,
 			Chip,
 			Fab,
 			Drawer,
 			List,
 			ListItem,
 			ListItemSecondaryAction,
 			ButtonBase	  } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useClasses from '../classes'
import styles from '../styles';


function DoMenu({ selectedMainCategoryID, setSelectedMainCategoryID, step, handleStep, cart, setCart, cartToken, setCartToken }) {

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [categoryList, setCategoryList] = React.useState([]);
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.get("https://mitsuki.qbmenu.ca/api/fetch/categories")
		.then((response) => {
			setCategoryList(response.data);
			setIsCategoryListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e);
       	});
	}, []);

	let [itemList, setItemList] = React.useState([]);
		//fetch items
		useEffect(()=> {
			Axios.post("https://mitsuki.qbmenu.ca/api/fetch/front/items")
			.then((response) => {
				setItemList(response.data);
			})
			.catch((e) => {
	       		console.log("error ", e);
	       	});
		}, []);

	//check if cart system is disabled
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


	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);

	//Currently selected item variables, to add to cart
	const [selectedID, setSelectedID] = React.useState("");
	const [selectedName, setSelectedName] = React.useState("");
	const [selectedDesc, setSelectedDesc] = React.useState("");
	const [selectedPrice, setSelectedPrice] = React.useState("");
	const [selectedImg, setSelectedImg] = React.useState("");
	const [selectedQuantity, setSelectedQuantity] = React.useState(1);

	//Toggle drawer open/close state
	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	}
	//Toggle menu item dialog open state
	const openDialog = (event, id, name, desc, price, img) => {

		setDialogOpen(true);

		setSelectedID(id);
		setSelectedName(name);
		setSelectedDesc(desc);
		setSelectedPrice(price.toFixed(2));
		setSelectedImg(img);
		setSelectedQuantity(1);
	}
	//Toggle menu item dialog close state
	const closeDialog = () => {

		setDialogOpen(false);

		setSelectedID("");
		setSelectedName("");
		setSelectedDesc("");
		setSelectedPrice("");
		setSelectedImg("");
		setSelectedQuantity(1);
	}


	//Add selected item to cart state and reset the selected item states
	const handleAddToCart = () => {

		let selectedItem = {
			itemID: selectedID,
			itemName: selectedName,
			itemQty: selectedQuantity,
			itemPrice: selectedPrice,
		};
		setCart(cartContent => [...cartContent, selectedItem]);
		closeDialog();
	}

	//Remove selected item from cart state
	const handleRemoveFromCart = (event, id) => {

		let tempCartContent = [...cart];
		let decrementedItem = {...tempCartContent[id]};
		
		//Search array for the item and filter it out from array
		//Replace current copy of cart with new filtered array
		let cleanTempCartContent = tempCartContent.filter((item, index) => index !== id);
		setCart(cleanTempCartContent);

	}

	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState("");
	//Update cart count and subtotal
	useEffect(()=> {

		if (cart.length === 0) {
			setCartCount("");
			setCartSubtotal(0);
			return;
		}
		//inital value so no errors are thrown
		let initialValue = 0;
		//sum up all cart quantities
		let tempCartCount = cart.reduce(function (previousValue, currentValue) {
		    return previousValue + currentValue.itemQty
		}, initialValue)

		let tempCartSubtotal = cart.reduce(function (previousValue, currentValue) {
			let currentTotal = currentValue.itemQty*currentValue.itemPrice;
			return previousValue + currentTotal;
		}, initialValue)

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2);

		setCartCount(tempCartCount);
		setCartSubtotal(tempCartSubtotal);

	}, [cart]);

	//Increment and decrement chosen item quantity
	const handleIncrement = () => {
		setSelectedQuantity(selectedQuantity+1);
	}
	const handleDecrement = () => {
		setSelectedQuantity(selectedQuantity-1);
	}

	//accordion expand
	const [expanded, setExpanded] = React.useState(false);
  	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleOrder = () => {
		Axios.post("https://mitsuki.qbmenu.ca/api/place/order", {
			cartToken: cartToken,
			cart: cart,
		})
		.then((response) => {
			handleStep(3);
		})
		.catch((e) => {
       		console.log("error ", e);
       	});
	}

	return <>
    <CssBaseline />
    <main className={classes.mainContainer}>
        <AppBar position="static">
            <Toolbar variant="dense">
                <Grid
                    justifyContent="flex-start"
                    alignItems="center"
                    container
                    spacing={2}
                >
                    <Grid item>
                        <IconButton onClick={() => handleStep(1)} color="inherit" size="large">
                            <HomeSharpIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">
                            Menu
                        </Typography>
                    </Grid>
                  </Grid>
            </Toolbar>
        </AppBar>
        <Container maxWidth="sm" className={classes.menuAccordionContainer}>
        {isCategoryListLoading && (

            <Typography>Chargement en cours...</Typography>

        )}
        {!isCategoryListLoading && (
            <>
            {categoryList.map((category, index) => {
                if(category.main_category_id === selectedMainCategoryID)
                return (
                    <Accordion key={index} className={classes.menuAccordion} disableGutters={true}>				  	
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id={index}
                        >
                            <Typography variant="h6">
                                {category.category_name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container className={classes.menuItemContainer}>
								{itemList.map((item, index) => (
								<>
									{item.category_id === category.category_id && (
									<Grid container direction="row" justifyContent="space-between" alignItems="center" item key={index} xs={12} className={classes.menuItem} onClick={(event) => openDialog(event, item.item_id, item.item_name, item.item_desc, item.item_price, item.item_img_url)}>
											<Grid item xs={8}>
												<Grid item xs={12} container direction="column" alignItems="flex-start" justifyContent="center" spacing={1} className={classes.menuItemText}>
													<Grid item xs={12}>
														<div className={classes.menuItemTextTitleDiv}>
															<Typography variant="h6" className={classes.menuItemTextTitle}>
																{item.item_name}
															</Typography>
														</div>
													</Grid>
													<Grid item xs={12}>
														<Typography variant="body1">
															{(item.item_price).toFixed(2)}$
														</Typography>
													</Grid>
													<Grid item xs={12}>
													<div className={classes.menuItemTextDescDiv}>
														<Typography variant="body2" className={classes.menuItemTextDesc}>
															{item.item_desc}
														</Typography>
													</div>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={4} justifyContent="center" alignItems="center">
												<img className={classes.menuItemMedia} src={item.item_img_url} />
											</Grid>
									</Grid>
								)}
								</>
								))}
							</Grid>
                        </AccordionDetails>
                    </Accordion>
            )})}
            </>
        )}
        {!cartDisabled && (
        <>
        <div className={classes.cartDrawerDiv}>
        <Drawer classes={{ paper: classes.cartDrawer, }} anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
            
                <List>
                <ListItem>
                    <Grid container alignItems="center" justifyContent="center">
                        <Typography variant="h6" color="textPrimary">
                            Votre Panier
                        </Typography>
                    </Grid>
                </ListItem>
                <Divider />
            {cart.map((item, index) => (
                <ListItem key={index}>
                    
                    <Grid container alignItems="center" direction="row" justifyContent="space-between">
                        <Grid item xs={9}>
                            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                                <Grid item xs={2}>
                                    <Chip label={item.itemQty} />
                                </Grid>
                                <Grid item xs={10} className={classes.cartDrawerItemName}>
                                    <Typography variant="subtitle2" color="textPrimary" className={classes.cartDrawerItemName}>
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
                    <ListItemSecondaryAction>
                        <IconButton 
                        color="default"
                        size="small"
                        edge="end"
                        onClick={(event) => handleRemoveFromCart(event, index)} 
                        >
                            <CloseIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
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
                <ListItem>
                    <Button onClick={handleOrder} variant="contained" color="primary" size="large" fullWidth={true} disabled={cart.length===0}>
                        Générer la Commande
                    </Button>
                </ListItem>
                </List>
            
        </Drawer>
        </div>
        </>
        )}
        <Dialog className={classes.dialogBox} open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
                <img 
                    className={classes.dialogMedia}
                    src={selectedImg}
                />		
            <DialogContent className={classes.dialogContent}>

                <DialogTitle className={classes.dialogTitle}>
                    {selectedName}
                    <br />
                    {selectedPrice}$
                </DialogTitle>
                
                <DialogContentText className={classes.dialogText}>
                    {selectedDesc}
                </DialogContentText>
            </DialogContent>
            {!cartDisabled && (
            <>
            <Divider />
                <DialogActions>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <IconButton
                                color="primary"
                                onClick={handleDecrement}
                                disabled={selectedQuantity <= 1}
                                size="large">
                                <RemoveCircleSharpIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Chip label={selectedQuantity} />						
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" onClick={handleIncrement} size="large">
                                <AddCircleSharpIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogActions>
                <DialogActions>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleAddToCart}>
                                Ajouter au panier
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
                </>
                )}
        </Dialog>
        
        </Container>
        
    </main>
    {!cartDisabled && (
    <Fab color="primary" variant="extended" className={classes.fab} onClick={toggleDrawer}>
        Voir le Panier {cartCount ? "("+cartCount+")" : ""}
    </Fab>
    )}
    </>;


}

export default DoMenu;