import React, { useState, useEffect } from 'react';
import Axios from 'axios';


import { 	Typography, 
 			Button,
 			Card, 
 			CardContent,
 			CardActionArea, 
 			CardMedia, 
 			CssBaseline,
 			Divider, 
 			Grid,  
 			Container,
 			Paper,
 			List,
 			ListItem,
 			ListItemText,
 			Menu,
 			MenuItem,
 			AppBar,
 			Toolbar,
 			TextField,
 			FormControl,
 			Select,
 			InputLabel   } from '@mui/material';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';


function AdminMainCategoryManager({ handleStep }) {


	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);
	

	let [categoryList, setCategoryList] = React.useState();
	let [isListLoading, setIsListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/main_categories")
		.then((response) => {
			setCategoryList(response.data);
			setIsListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	let [selCategory, setSelCategory] = React.useState(null);
	let [selDispCategory, setSelDispCategory] = React.useState(null);
	let [selCategoryOrderID, setSelCategoryOrderID] = React.useState(null);
	let [selCategoryName, setSelCategoryName] = React.useState(null);
	let [selCategoryMedia, setSelCategoryMedia] = React.useState(null);

	function handleSelCategory(id, name, mapIndex, orderIndex, imgUrl) {

		setSelCategory(id);
		setSelDispCategory(mapIndex);
		setSelCategoryName(name);
		setSelCategoryOrderID(orderIndex);
		setSelCategoryMedia(imgUrl);
	}

	let [showCreateCategory, setShowCreateCategory] = React.useState(null);

	function handleCreateClick() {

		setSelCategory(null);
		setSelDispCategory(null);
		setSelCategoryName(null);
		setCategoryMedia(null);
		setCategoryMediaTempURL(null);
		setSelCategoryMedia(null);

		if (showCreateCategory === null) {
			setShowCreateCategory(1);
		}
		if (showCreateCategory === 1) {
			setShowCreateCategory(null);
		}
	}


	let [categoryMedia, setCategoryMedia] = React.useState(null);
	//temp image preview
	let [categoryMediaTempURL, setCategoryMediaTempURL] = React.useState(null);

	//file upload function
	const handleFileUpload = e => {

		if(selCategoryMedia) {
			setSelCategoryMedia(null);
		}

		//get image to upload
		setCategoryMedia(e.target.files[0]);
		//create temp url to preview image
		setCategoryMediaTempURL(URL.createObjectURL(e.target.files[0]));

	}


	//category name to be inserted from text input
	let [categoryName, setCategoryName] = React.useState("");

	function handleCreateCategory() {

		if(categoryName && categoryMedia) {


			//use new FormData() method to create a submitted form
			const formData = new FormData();

			//add uploaded image and other form fields to the data
			formData.append('file', categoryMedia);
			formData.append('categoryName', categoryName);


			Axios.post("https://mitsuki.qbmenu.ca/api/add/main_category", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			//empty text box value
			setCategoryName("");
			setCategoryMedia(null);
			setCategoryMediaTempURL(null);
			
		}

	};
	//delete category
	function handleDeleteCategory() {
		if(selCategory) {

			Axios.post("https://mitsuki.qbmenu.ca/api/delete/main_category", {
				selCategory: selCategory,
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
				//reset selection
				setSelCategory(null);
				setSelCategoryName(null);
				setSelDispCategory(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	};

	//show/hide move category menu
	let [showMoveCategory, setShowMoveCategory] = React.useState(null);

	function handleMoveCategoryClick() {

		if (showMoveCategory === null) {
			setShowMoveCategory(1);
		}
		if (showMoveCategory === 1) {
			//reset all var and close menu
			setShowMoveCategory(null);
			setSelCategory(null);
			setSelDispCategory(null);
			setSelCategoryName(null);
		}
	}

	//moving category sort item up(1) or down(0)
	function handleMoveCategory(direction) {

		//current selected category id and order index
		var currentRowID = selCategory;
		var currentRowOrderID = selCategoryOrderID;

		//check if first item on list trying to move up
		//or if last item on list trying to move down
		const currentRowMapID = selDispCategory-1;
		if(currentRowMapID === 0 && direction === 1 || currentRowMapID === categoryList.length-1 && direction === 0) {
			return;
		}

		//setup vars to hold next row info
		var nextRowID;
		var nextRowOrderID;


		if(direction === 1) {
			//get id and order index of row above
			nextRowID = categoryList[currentRowMapID-1].main_category_id;
			nextRowOrderID = categoryList[currentRowMapID-1].main_category_order_index;

			//set display number and order index to row above
			setSelDispCategory(currentRowMapID);
			setSelCategoryOrderID(nextRowOrderID)
		}
		if(direction === 0) {
			//get id and order index of row below
			nextRowID = categoryList[currentRowMapID+1].main_category_id;
			nextRowOrderID = categoryList[currentRowMapID+1].main_category_order_index;

			//set display number and order index to row below
			setSelDispCategory(currentRowMapID+2);
			setSelCategoryOrderID(nextRowOrderID)
		}

		//send to backend
		Axios.post("https://mitsuki.qbmenu.ca/api/move/main_category", {
			currentRowID: currentRowID,
			currentRowOrderID: currentRowOrderID,
			nextRowID: nextRowID,
			nextRowOrderID: nextRowOrderID,
		})
		.then((response) => {
			//update category list with new data
			setCategoryList(response.data);

		})
		.catch((e) => {
       		console.log("error ", e)});

	};

	let [showEditCategory, setShowEditCategory] = React.useState(null);

	//show or hide category edit box
	function handleEditClick() {

		if (showEditCategory === null) {
			setShowEditCategory(1);	
		}
		if (showEditCategory === 1) {
			setShowEditCategory(null);
			//reset selection
			setSelCategory(null);
			setSelCategoryName(null);
			setSelDispCategory(null);
		}
	}


	//edit category
	function handleEditCategory() {

		//check if all fields are filled
		//if image changed
		if(selCategoryName && categoryMedia) {

			//use new FormData() method to create a submitted form
			const formData = new FormData();

			//add uploaded image and other form fields to the data
			formData.append('file', categoryMedia);
			formData.append('categoryName', selCategoryName);
			formData.append('selCategory', selCategory);

			Axios.post("https://mitsuki.qbmenu.ca/api/edit/main_category", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
				setShowEditCategory(null);
				//reset selection
				setSelCategory(null);
				setSelCategoryName(null);
				setSelDispCategory(null);
				//images
				setSelCategoryMedia(null);
				setCategoryMedia(null);
				setCategoryMediaTempURL(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			
		}

		//check if all fields are filled
		//if image didnt change
		if(selCategoryName && !categoryMedia) {

			Axios.post("https://mitsuki.qbmenu.ca/api/edit/main_category", {
				categoryName: selCategoryName,
				selCategory: selCategory,
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
				setShowEditCategory(null);
				//reset selection
				setSelCategory(null);
				setSelCategoryName(null);
				setSelDispCategory(null);
				//images
				setSelCategoryMedia(null);
				setCategoryMedia(null);
				setCategoryMediaTempURL(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});

		}
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
		<Grid container direction="row">
				<Grid item xs={8}>
					<Container maxWidth={false} className={classes.adminCategoryManagerCardGridContainer}>
						<Container className={classes.adminCategoryManagerCardGrid} maxWidth="md">
							{isListLoading && (

								<Typography>loading...</Typography>

							)}
							{!isListLoading && (
								<Grid container direction="column" spacing={2}>
									<Grid item>
										<Typography variant="h5" color="textPrimary">
											Main Categories
										</Typography>
									</Grid>
									<Divider className={classes.adminCategoryDivider} />								
								{categoryList.map((category, index) => (
									<Grid item key={category.category_id}>
									
										<Card className={classes.Card}>
										<CardActionArea onClick={() => handleSelCategory(category.main_category_id, category.main_category_name, index+1, category.main_category_order_index, category.main_category_img_url)}>
											<Grid className={classes.adminCategoryManagerCard} container alignItems="center" justifyContent="space-between">
												<Grid item>
													<Typography variant="subtitle2" color="textPrimary">
														{index+1}.
													</Typography>
												</Grid>
												<Grid item>
													<Typography variant="subtitle2" color="textPrimary">
														{category.main_category_name}
													</Typography>
												</Grid>
											</Grid>
										</CardActionArea>
										</Card>
									</Grid>
								))}
								</Grid>

								)}

						</Container>
					</Container>
				</Grid>
				<Grid item xs={4}>
					<Paper elevation={1}>
						<Container maxWidth={false} className={classes.adminNavigationContainer}>


							<List>
								<ListItem>
									<Typography variant="h5" color="textPrimary" align="center">
										Main Category Manager
									</Typography>
								</ListItem>
								{selDispCategory && [ showCreateCategory === null &&
								<ListItem>
									<Typography variant="h6" color="textPrimary" align="center">
										{selDispCategory}. {selCategoryName}
									</Typography>
								</ListItem>
								]}
								<Divider />
								{showCreateCategory === null && [ 
									showMoveCategory === null && [
										showEditCategory === null &&
								<>
								<ListItem button onClick={() => handleCreateClick()}>
									<ListItemText primary="Add New Main Category" />
								</ListItem>	
								<ListItem button disabled={selCategory === null} onClick={() => handleEditClick()}>
									<ListItemText primary="Edit Main Category" />
								</ListItem>															
								<ListItem button disabled={selCategory === null} onClick={() => handleMoveCategoryClick()}>
									<ListItemText primary="Move Main Category" />
								</ListItem>
								<ListItem button disabled={selCategory === null} onClick={() => handleDeleteCategory()}>
									<ListItemText primary="Remove Main Category" />
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleStep(1000)}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								]]}
								{showMoveCategory === 1 && (
								<>
								<ListItem button onClick={() => handleMoveCategory(1)} disabled={selDispCategory-1 === 0}>
									<ListItemText primary="Move Category Up" />
								</ListItem>
								<ListItem button onClick={() => handleMoveCategory(0)} disabled={selDispCategory-1 === categoryList.length-1}>
									<ListItemText primary="Move Category Down" />
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleMoveCategoryClick()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)}
								{showEditCategory === 1 && (
								<>
								<ListItem>
								<form>
									<Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
										<Grid item>
											<Typography variant="h5">
												Edit Main Category
											</Typography>
										</Grid>
										<Grid item>
											<img src={selCategoryMedia} className={classes.adminCategoryManagerCategoryImage} hidden={!selCategoryMedia}/>
										</Grid>
										<Grid item>
											<img src={categoryMediaTempURL} className={classes.adminCategoryManagerCategoryImage} hidden={!categoryMediaTempURL}/>
										</Grid>
										<Grid item>
												<input
											        accept="image/jpeg, image/png"
											        id="contained-button-file"
											        type="file"
											        onChange={handleFileUpload}
											        hidden
											    />
											    <label htmlFor="contained-button-file">
											      <Button variant="outlined" color="primary" component="span">
											      	Upload Image
											      </Button>
											    </label>
										</Grid>
										<Grid item>
											<TextField 
												id="category" 
												label="Category Name"
												onChange={(e) => {setSelCategoryName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={selCategoryName} 
											/>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleEditCategory()} disabled={!selCategoryName || (!categoryMediaTempURL && !selCategoryMedia)}>
												Save Edit
											</Button>
										</Grid>
									</Grid>
								</form>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleEditClick()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)}
								{showCreateCategory === 1 && (
								<>
								<ListItem>
								<form>
									<Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
										<Grid item>
											<Typography variant="h5">
												Create New Category
											</Typography>
										</Grid>
										<Grid item>
											<img src={categoryMediaTempURL} className={classes.adminCategoryManagerCategoryImage} hidden={!categoryMediaTempURL}/>
										</Grid>
										<Grid item>
												<input
											        accept="image/jpeg, image/png"
											        id="contained-button-file"
											        type="file"
											        onChange={handleFileUpload}
											        hidden
											    />
											    <label htmlFor="contained-button-file">
											      <Button variant="outlined" color="primary" component="span">
											      	Upload Image
											      </Button>
											    </label>
										</Grid>
										<Grid item>
											<TextField 
												id="category" 
												label="Category Name"
												onChange={(e) => {setCategoryName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={categoryName} 
											/>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleCreateCategory()} disabled={!categoryName || !categoryMedia}>
												Add Category
											</Button>
										</Grid>
									</Grid>
								</form>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleCreateClick()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)}
							</List>


						</Container>
					</Paper>
				</Grid>
		</Grid>
		</main>

</>
		)
}

export default AdminMainCategoryManager;