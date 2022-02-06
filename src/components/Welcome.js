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
 			ButtonBase	   } from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useClasses from '../classes'
import styles from '../styles';

function Welcome({ selectedMainCategoryID, setSelectedMainCategoryID, handleStep, cart, setCart, cartToken, setCartToken }) {

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);


	let [mainCategoryList, setMainCategoryList] = React.useState([]);
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);

	//fetch main categories
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/main_categories")
		.then((response) => {
			setMainCategoryList(response.data);
			setIsCategoryListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);
	//main category selection
	function handleSelect(id) {
		handleStep(2);
		setSelectedMainCategoryID(id);
	}




	//variables to generate unique cart token
	const ID_LENGTH = 16
	const START_LETTERS_ASCII = 97 // Use 64 for uppercase
	const ALPHABET_LENGTH = 26
	//function to generate unique cart token
	const uniqueID = () => [...new Array(ID_LENGTH)]
	  .map(() => String.fromCharCode(START_LETTERS_ASCII + Math.random() * ALPHABET_LENGTH))
	 .join('')

	//Check if cart token exists
	useEffect(()=> {
		//If token doesn't exist, generate new token
		if(!cartToken) {	
			setCartToken(uniqueID());
		}
	}, []);

	

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
			<Container maxWidth="sm">
			{isCategoryListLoading && (

				<Typography>Chargement en cours...</Typography>

			)}
			{!isCategoryListLoading && (
				<ImageList>
				{mainCategoryList.map((main, index) => {
					if(main.disabled === 0) {
						return (
							<ImageListItem key={index} cols={2} rows={2} onClick={() => handleSelect(main.main_category_id)}>
									<img src={main.main_category_img_url} />
									<ImageListItemBar
						              title={main.main_category_name}
						              className={classes.categoryBar}
						              position="bottom"
						            />
							</ImageListItem>
						)
					}
					if(main.disabled === 1) {
						return (
							<ImageListItem key={index} cols={2} rows={2}>
									<img src={main.main_category_img_url} />
									<ImageListItemBar
						              title={main.main_category_name+" - Bientôt disponible"}
						              className={classes.categoryBar}
						              position="bottom"
						            />
							</ImageListItem>
						)
					}
				})}
				</ImageList>
			)}
			</Container>
		</main>
		</>
	)


}

export default Welcome;