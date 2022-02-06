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


function AdminCategoryManager({ handleStep }) {


	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);
	

	let [categoryList, setCategoryList] = React.useState();
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.get("https://mitsuki.qbmenu.ca/api/fetch/categories")
		.then((response) => {
			setCategoryList(response.data);
			setIsCategoryListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	let [mainCategoryList, setMainCategoryList] = React.useState();
	let [isMainCategoryListLoading, setIsMainCategoryListLoading] = React.useState(true);
	//fetch main categories
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/main_categories")
		.then((response) => {
			setMainCategoryList(response.data);
			setIsMainCategoryListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);



	let [selCategory, setSelCategory] = React.useState(null);
	let [selDispCategory, setSelDispCategory] = React.useState(null);
	let [selCategoryOrderID, setSelCategoryOrderID] = React.useState(null);
	let [selCategoryName, setSelCategoryName] = React.useState(null);
	let [selMainCategoryID, setSelMainCategoryID] = React.useState();

	function handleSelCategory(id, name, mapIndex, orderIndex, mainId) {

		setSelCategory(id);
		setSelDispCategory(mapIndex);
		setSelCategoryName(name);
		setSelCategoryOrderID(orderIndex);
		setSelMainCategoryID(mainId);

		console.log("id:"+id);
		console.log("name:"+name);
		console.log("mapIndex:"+mapIndex);
		console.log("orderIndex:"+orderIndex);
		console.log("mainId:"+mainId);

		console.log(categoryList[mapIndex-1].main_category_id)

	}

	let [showCreateCategory, setShowCreateCategory] = React.useState(null);

	function handleCreateClick() {

		setSelCategory(null);
		setSelDispCategory(null);
		setSelCategoryName(null);
		setSelMainCategoryID("");

		if (showCreateCategory === null) {
			setShowCreateCategory(1);
		}
		if (showCreateCategory === 1) {
			setShowCreateCategory(null);
		}
	}

	//category name to be inserted from text input
	let [categoryName, setCategoryName] = React.useState("");

	function handleCreateCategory() {

		if(categoryName) {

			Axios.post("https://mitsuki.qbmenu.ca/api/add/category", {
				categoryName: categoryName,
				selMainCategoryID: selMainCategoryID,
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			//empty text box value
			setCategoryName("");
			setSelMainCategoryID("");
			
		}

	};
	//delete category
	function handleDeleteCategory() {
		if(selCategory) {

			Axios.post("https://mitsuki.qbmenu.ca/api/delete/category", {
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
		var currentRowMainCatID = selMainCategoryID;

		//check if first item on list trying to move up
		//or if last item on list trying to move down
		const currentRowMapID = selDispCategory-1;
		if(currentRowMapID === 0 && direction === 1 || currentRowMapID === categoryList.length-1 && direction === 0) {
			return;
		}

		//setup vars to hold next row info
		var nextRowID;
		var nextRowOrderID;
		var nextRowMainCatID;


		if(direction === 1) {
			//get id and order index of row above
			nextRowID = categoryList[currentRowMapID-1].category_id;
			nextRowOrderID = categoryList[currentRowMapID-1].category_order_index;
			nextRowMainCatID = categoryList[currentRowMapID-1].main_category_id;

			//set display number and order index to row above
			setSelDispCategory(currentRowMapID);
			setSelCategoryOrderID(nextRowOrderID);
			setSelMainCategoryID(nextRowMainCatID);
		}
		if(direction === 0) {
			//get id and order index of row below
			nextRowID = categoryList[currentRowMapID+1].category_id;
			nextRowOrderID = categoryList[currentRowMapID+1].category_order_index;
			nextRowMainCatID = categoryList[currentRowMapID+1].main_category_id;

			//set display number and order index to row below
			setSelDispCategory(currentRowMapID+2);
			setSelCategoryOrderID(nextRowOrderID);
			setSelMainCategoryID(nextRowMainCatID);
		}

		//send to backend
		Axios.post("https://mitsuki.qbmenu.ca/api/move/category", {
			currentRowID: currentRowID,
			currentRowOrderID: currentRowOrderID,
			currentRowMainCatID: currentRowMainCatID,
			nextRowID: nextRowID,
			nextRowOrderID: nextRowOrderID,
			nextRowMainCatID: nextRowMainCatID,
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
			setSelMainCategoryID("");
		}
	}


	//edit category
	function handleEditCategory() {
		if(selCategoryName) {

			Axios.post("https://mitsuki.qbmenu.ca/api/edit/category", {
				categoryName: selCategoryName,
				selCategory: selCategory,
				selMainCategoryID: selMainCategoryID,
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
				setShowEditCategory(null);
				//reset selection
				setSelCategory(null);
				setSelCategoryName(null);
				setSelDispCategory(null);
				setSelMainCategoryID("");
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
							{isMainCategoryListLoading && (

								<Typography>loading...</Typography>

							)}
							{!isMainCategoryListLoading && (
								<Grid container direction="column" spacing={2}>
								{mainCategoryList.map((main, mainIndex) => (
								<>
										<Grid item key={mainIndex}>
											<Typography variant="h5" color="textPrimary">
												{main.main_category_name}
											</Typography>
										</Grid>	
								{isCategoryListLoading && (

									<Typography>loading...</Typography>

								)}
								{!isCategoryListLoading && (
								<>							
									{categoryList.map((category, index) => {
										if(category.main_category_id === main.main_category_id) {
											return (
												<Grid item key={category.category_id}>
												
													<Card className={classes.Card}>
													<CardActionArea onClick={() => handleSelCategory(category.category_id, category.category_name, index+1, category.category_order_index, category.main_category_id)}>
														<Grid className={classes.adminCategoryManagerCard} container alignItems="center" justifyContent="space-between">
															<Grid item>
																<Typography variant="subtitle2" color="textPrimary">
																	{category.category_name}
																</Typography>
															</Grid>
														</Grid>
													</CardActionArea>
													</Card>
												</Grid>
											)
										}
									})}
								</>
								)}
								<Divider className={classes.adminCategoryDivider} />
								</>
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
										Category Manager
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
									<ListItemText primary="Add New Category" />
								</ListItem>	
								<ListItem button disabled={selCategory === null} onClick={() => handleEditClick()}>
									<ListItemText primary="Edit Category" />
								</ListItem>															
								<ListItem button disabled={selCategory === null} onClick={() => handleMoveCategoryClick()}>
									<ListItemText primary="Move Category" />
								</ListItem>
								<ListItem button disabled={selCategory === null} onClick={() => handleDeleteCategory()}>
									<ListItemText primary="Remove Category" />
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
												Edit Category
											</Typography>
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
										<Grid item className={classes.adminCategoryManagerSelectedMain}>
										    <Typography variant="h6">
										    	Choose Main Category
										    </Typography>
										    <FormControl className={classes.adminCategoryManagerSelect}>
										    	<InputLabel>Main Categories</InputLabel>
												<Select
													value={selMainCategoryID}
													onChange={(e) => {setSelMainCategoryID(e.target.value)}} 
													variant="filled"
												>
													{mainCategoryList.map((category, index) => (
											            <MenuItem key={index} value={category.main_category_id}>
											              {category.main_category_name}
											            </MenuItem>
											          ))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleEditCategory()} disabled={!selCategoryName}>
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
											<TextField 
												id="category" 
												label="Category Name"
												onChange={(e) => {setCategoryName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={categoryName} 
											/>
										</Grid>
										<Grid item className={classes.adminCategoryManagerSelectedMain}>
										    <Typography variant="h6">
										    	Choose Main Category
										    </Typography>
										    <FormControl className={classes.adminCategoryManagerSelect}>
										    	<InputLabel>Main Categories</InputLabel>
												<Select
													value={selMainCategoryID}
													onChange={(e) => {setSelMainCategoryID(e.target.value)}} 
													variant="filled"
												>
													{mainCategoryList.map((category, index) => (
											            <MenuItem key={index} value={category.main_category_id}>
											              {category.main_category_name}
											            </MenuItem>
											          ))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleCreateCategory()}>
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

export default AdminCategoryManager;