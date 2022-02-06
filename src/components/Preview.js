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


function Preview({ handleStep, selectedMainCategoryID, setSelectedMainCategoryID }) {

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [mainCategoryList, setMainCategoryList] = React.useState([]);
	//fetch main categories
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/main_categories")
		.then((response) => {
			setMainCategoryList(response.data);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);
	//main category selection
	function handleSelect(id) {
		handleStep(2);
		setSelectedMainCategoryID(id);
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
			<Container maxWidth="sm">
				<ImageList>
				{mainCategoryList.map((main, index) => {
					if(main.main_category_id !== 4) {
						return (
							<ImageListItem key={index} cols={2} rows={2} onClick={() => handleSelect(main.main_category_id)}>
									<img src={main.main_category_img_url} />
									<ImageListItemBar
						              title={main.main_category_name}
						              className={classes.categoryBar}
						              position="bottom"
						            />
							</ImageListItem>
				)}})}
				</ImageList>
			</Container>
		</main>
		</>
	)


}

export default Preview;