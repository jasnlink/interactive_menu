import React, { useState, useEffect } from 'react';
import Axios from 'axios';


import { 	Typography,
			Avatar,
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
 			FormControl,
 			InputLabel,
 			Select,
 			AppBar,
 			Toolbar,
 			TextField   } from '@mui/material';

import Image from 'material-ui-image'
import NumericInput from 'material-ui-numeric-input';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';


function AdminItemManager({ handleStep }) {


	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [selCategoryID, setSelCategoryID] = React.useState(null);
	let [selCategoryName, setSelCategoryName] = React.useState(null);

	function handleSelectCategory(catID, catName) {

		if(catID !== selCategoryID) {

			setSelCategoryID(catID);
			setIsItemListLoading(true);
			setSelCategoryName(catName);

			if(selItemID) {
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setItemMediaTempURL(null);
				setSelItemMedia(null);
				setSelItemDisabled(null);

				//close edit form
				setShowEditItem(null);
			}

		}
		if(catID === selCategoryID) {
			return;
		}

	}

	let [selItemID, setSelItemID] = React.useState(null);
	let [selItemMap, setSelItemMap] = React.useState(null);
	let [selItemOrder, setSelItemOrder] = React.useState(null);
	let [selItemName, setSelItemName] = React.useState('');
	let [selItemDesc, setSelItemDesc] = React.useState('');
	let [selItemPrice, setSelItemPrice] = React.useState(0);
	let [selItemDisabled, setSelItemDisabled] = React.useState(null);
	let [selItemMedia, setSelItemMedia] = React.useState(null);

	function handleSelectItem(itemID, itemDisp, itemOrder, itemName, itemDesc, itemPrice, itemMedia, itemDisabled) {

		if(itemID !== selItemID) {

			setSelItemID(itemID);
			setSelItemMap(itemDisp);
			setSelItemOrder(itemOrder);
			setSelItemName(itemName);
			setSelItemDesc(itemDesc);
			setSelItemPrice(itemPrice);
			setSelItemMedia(itemMedia);
			setSelItemDisabled(itemDisabled);
			setItemMediaTempURL(null);
			setItemMedia('');

		}
		if(itemID === selItemID) {
			return;
		}
	}


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


	let [itemList, setItemList] = React.useState();
	let [isItemListLoading, setIsItemListLoading] = React.useState(false);

	//fetch menu items from selected category
	useEffect(()=> {
		Axios.post("https://mitsuki.qbmenu.ca/api/fetch/items", {
				selCategoryID: selCategoryID,
			})
		.then((response) => {
			setItemList(response.data);
			setIsItemListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, [selCategoryID]);


	let [showCreateItem, setShowCreateItem] = React.useState(null);

	function handleAddNewButton() {

		if (showCreateItem === null) {
			setShowCreateItem(1);
		}
		if (showCreateItem === 1) {
			setShowCreateItem(null);
		}
	}

	let [itemName, setItemName] = React.useState('');
	let [itemDesc, setItemDesc] = React.useState('');
	let [itemPrice, setItemPrice] = React.useState(0);
	let [itemMedia, setItemMedia] = React.useState('');
	//temporary file preview var
	let [itemMediaTempURL, setItemMediaTempURL] = React.useState(null);

	function handleCancelNewItem() {

		//reset form
		setItemName('');
		setItemDesc('');
		setItemPrice('');
		setItemMedia('');
		setItemMediaTempURL(null);

		setShowCreateItem(null);
	}

	function handleAddNewItem() {

		if(selCategoryID && itemName && itemMedia) {
			//use new FormData() method to create a submitted form
			const formData = new FormData();

			//add uploaded image and other form fields to the data
			formData.append('file', itemMedia);
			formData.append('selCategoryID', selCategoryID);
			formData.append('itemName', itemName);
			formData.append('itemDesc', itemDesc);
			formData.append('itemPrice', itemPrice);

			Axios.post("https://mitsuki.qbmenu.ca/api/add/item", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				handleCancelNewItem();
			})
			.catch((e) => {
	       		console.log("error ", e)});
			
		}

	}

	const handleFileUpload = e => {

		if(selItemMedia) {
			setSelItemMedia(null);
		}

		//get image to upload
		setItemMedia(e.target.files[0]);
		//create temp url to preview image
		setItemMediaTempURL(URL.createObjectURL(e.target.files[0]));

	}


	let [showEditItem, setShowEditItem] = React.useState(null);

	function handleEditButton() {

		if (showEditItem === null) {
			setShowEditItem(1);
		}
		if (showEditItem === 1) {
			setShowEditItem(null);
		}
	}

	function handleEditItem() {

		//check if all fields are filled
		//if image changed
		if(selCategoryID && selItemID && selItemName && itemMedia) {
			//use new FormData() method to create a submitted form
			const formData = new FormData();

			//add uploaded image and other form fields to the data
			formData.append('file', itemMedia);
			formData.append('selCategoryID', selCategoryID);
			formData.append('selItemID', selItemID);
			formData.append('selItemName', selItemName);
			formData.append('selItemDesc', selItemDesc);
			formData.append('selItemPrice', selItemPrice);

			Axios.post("https://mitsuki.qbmenu.ca/api/edit/item", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemPrice(0);
				setSelItemMedia(null);
				setSelItemDisabled(null);

				setItemMedia('');
				setItemMediaTempURL(null);

				//close edit form
				setShowEditItem(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			
		}
		//check if all fields are filled
		//if image didnt change
		if(selCategoryID && selItemID && selItemName && !itemMedia) {

			Axios.post("https://mitsuki.qbmenu.ca/api/edit/item", {
				selCategoryID: selCategoryID,
				selItemID: selItemID,
				selItemName: selItemName,
				selItemDesc: selItemDesc,
				selItemPrice: selItemPrice,
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemPrice(0);
				setSelItemMedia(null);
				setItemMediaTempURL(null);
				setSelItemDisabled(null);

				//close edit form
				setShowEditItem(null);
			})
			.catch((e) => {
				const { code } = e?.response?.data
	       		console.log("error ", e)
	       		console.log(e.response.data);
      			console.log(e.response.status);
      			console.log(e.response.headers);
	       	});
		}

	}
	function handleCancelEditItem() {

		//reset form
		setSelItemID(null);
		setSelItemMap(null);
		setSelItemOrder(null);
		setSelItemName('');
		setSelItemDesc('');
		setSelItemPrice(0);
		setSelItemMedia(null);
		setSelItemDisabled(null);
		setItemMediaTempURL(null);
		setItemMedia('');

		//close edit form
		setShowEditItem(null);
	}

	//moving item sort item up(1) or down(0)
	function handleMoveItem(direction) {

		//current selected item id and order index
		var currentRowID = selItemID;
		var currentRowOrderID = selItemOrder;

		//check if first item on list trying to move up
		//or if last item on list trying to move down
		const currentRowMapID = selItemMap;
		if(currentRowMapID === 0 && direction === 1 || currentRowMapID === itemList.length-1 && direction === 0) {
			return;
		}

		//setup vars to hold next row info
		var nextRowID;
		var nextRowOrderID;


		if(direction === 1) {
			//get id and order index of row above
			nextRowID = itemList[currentRowMapID-1].item_id;
			nextRowOrderID = itemList[currentRowMapID-1].item_order_index;

			//set order index to row above
			//set item map to row above
			setSelItemOrder(nextRowOrderID);
			setSelItemMap(selItemMap-1);
		}
		if(direction === 0) {
			//get id and order index of row below
			nextRowID = itemList[currentRowMapID+1].item_id;
			nextRowOrderID = itemList[currentRowMapID+1].item_order_index;

			//set order index to row below
			//set item map to row below
			setSelItemOrder(nextRowOrderID);
			setSelItemMap(selItemMap+1);
		}

		//send to backend
		Axios.post("https://mitsuki.qbmenu.ca/api/move/item", {
			selCategoryID: selCategoryID,
			currentRowID: currentRowID,
			currentRowOrderID: currentRowOrderID,
			nextRowID: nextRowID,
			nextRowOrderID: nextRowOrderID,
		})
		.then((response) => {
			//update item list with new data
			setItemList(response.data);

		})
		.catch((e) => {
       		console.log("error ", e)});

	};
	let [showMoveItem, setShowMoveItem] = React.useState(null);

	function handleMoveButton() {

		if (showEditItem === null) {
			setShowMoveItem(1);
		}
		if (showEditItem === 1) {
			setShowMoveItem(null);
		}
	}
	function handleCancelMoveItem() {
		//reset form
		setSelItemID(null);
		setSelItemMap(null);
		setSelItemOrder(null);
		setSelItemName('');
		setSelItemDesc('');
		setSelItemPrice(0);
		setSelItemMedia(null);
		setSelItemDisabled(null);

		//close edit form
		setShowMoveItem(null);
	}

	let [selNewCategoryID, setSelNewCategoryID] = React.useState('');
	let [selNewCategoryName, setSelNewCategoryName] = React.useState('');



	let [showChangeItemCategory, setShowChangeItemCategory] = React.useState(null);
	function handleChangeItemCategoryButton() {

		if (showChangeItemCategory === null) {
			setShowChangeItemCategory(1);
			setSelNewCategoryID(selCategoryID);
		}
		if (showChangeItemCategory === 1) {
			setShowChangeItemCategory(null);
			setSelNewCategoryID('');
		}
	}
	function handleCancelChangeItemCategory() {
		//reset form
		setSelItemID(null);
		setSelItemMap(null);
		setSelItemOrder(null);
		setSelItemName('');
		setSelItemDesc('');
		setSelItemPrice(0);
		setSelItemMedia(null);
		setSelItemDisabled(null);

		//close form
		setShowChangeItemCategory(null);
	}
	function handleSelNewCategory(catID, catName) {

		setSelNewCategoryID(catID);
		setSelNewCategoryName(catName);

	}
	function handleChangeItemCategory() {

		Axios.post("https://mitsuki.qbmenu.ca/api/change/item", {
				selItemID: selItemID,
				selNewCategoryID: selNewCategoryID,
				selCategoryID: selCategoryID
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemPrice(0);
				setSelItemMedia(null);
				setSelItemDisabled(null);

				setSelNewCategoryID('');
				setSelNewCategoryName('');

				//close form
				setShowChangeItemCategory(null);
			})
			.catch((e) => {
		   		console.log("error ", e)});
	}

	//delete item
	function handleDeleteItem() {
		if(selItemID) {

			Axios.post("https://mitsuki.qbmenu.ca/api/delete/item", {
				selCategoryID: selCategoryID,
				selItemID: selItemID
			})
			.then((response) => {
				//update category list with fresh data
				setItemList(response.data);

				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemPrice(0);
				setSelItemMedia(null);
				setSelItemDisabled(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	}
	//enable or disable item
	function handleToggleItem() {

		var disabled = !selItemDisabled;

		if(selItemID) {

			Axios.post("https://mitsuki.qbmenu.ca/api/toggle/item", {
				selCategoryID: selCategoryID,
				selItemID: selItemID,
				disabled: disabled
			})
			.then((response) => {
				setItemList(response.data);
				setSelItemDisabled(!selItemDisabled);
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
				<Grid item xs={3} className={classes.adminMenuListContainer}>
						<Container className={classes.adminMenuManagerCategoryCardGrid} maxWidth="md">
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
													<Grid item key={index}>
														<Card className={classes.Card}>
														<CardActionArea onClick={() => handleSelectCategory(category.category_id, category.category_name)}>
															<Grid className={classes.adminMenuManagerCategoryCard} container alignItems="center" justifyContent="space-between">
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
				</Grid>
				<Grid item xs={6} className={classes.adminMenuListContainer}>
						<Container className={classes.adminMenuManagerItemCardGrid} maxWidth="md">
						{isItemListLoading && [ selCategoryID &&

							<Typography>loading...</Typography>

						]}
						{!isItemListLoading && [ selCategoryID &&
							<Grid container direction="column" spacing={2}>
								<Grid item>
									<Typography variant="h5" color="textPrimary">
										{selCategoryName}
									</Typography>
								</Grid>
							{itemList.map((item, index) => (
								<Grid item key={index}>
									<Card className={classes.Card}>
									<CardActionArea onClick={() => handleSelectItem(item.item_id, index, item.item_order_index, item.item_name, item.item_desc, item.item_price, item.item_img_url, item.disabled)}>
										<Grid container direction="row" alignItems="center" justifyContent="space-between" className={classes.adminMenuManagerItemCard}>
											<Grid item>
												<Avatar className={classes.adminMenuManagerItemMedia} src={item.item_img_url} variant="rounded" />
											</Grid>
											<Grid item>
											<Grid container direction="column" justifyContent="space-between" alignItems="center">
											<Grid item>
												<Typography variant="subtitle2" color="textPrimary">
													{item.item_name}
												</Typography>
											</Grid>
											<Grid item>
												<Typography variant="subtitle2" color="textPrimary">
													$ {item.item_price}
												</Typography>
											</Grid>
											</Grid>
											</Grid>
											<Grid item>
												<Typography variant="subtitle2" color="textPrimary">
													{item.disabled === 0 ? ("Enabled") : ("Disabled")}
												</Typography>
											</Grid>
										</Grid>
									</CardActionArea>
									</Card>
								</Grid>
							))}
							</Grid>
						]}
						{!isItemListLoading && [ selCategoryID && [ itemList.length === 0 &&

							<Typography>Category has no items...</Typography>

						]]}
						</Container>
				</Grid>
				<Grid item xs={3}>
					<Paper elevation={1}>
						<Container maxWidth={false} className={classes.adminNavigationContainer}>
							<List>
								<ListItem>
									<Typography variant="h5" color="textPrimary" align="center">
										Menu Manager
									</Typography>
								</ListItem>
								<Divider />
								{showCreateItem === null && [  showEditItem === null && [ showMoveItem === null &&  [ showChangeItemCategory === null && (
								<>
								<ListItem button disabled={selCategoryID === null} onClick={() => handleAddNewButton()}>
									<ListItemText primary="Add New Item"/>
								</ListItem>
								<ListItem button disabled={selItemID === null} onClick={() => handleEditButton()}>
									<ListItemText primary="Edit Item"/>
								</ListItem>
								<ListItem button disabled={selItemID === null} onClick={() => handleMoveButton()}>
									<ListItemText primary="Move Item"/>
								</ListItem>
								<ListItem button disabled={selItemID === null} onClick={() => handleChangeItemCategoryButton()}>
									<ListItemText primary="Change Item Category"/>
								</ListItem>
								<ListItem button disabled={selItemID === null} onClick={() => handleToggleItem()}>
									{(() => {
									  if (selItemDisabled) {
									    return <ListItemText primary="Enable Item" />;
									  } else {
									    return <ListItemText primary="Disable Item" />;
									  }
									})()}
								</ListItem>
								<ListItem button disabled={selItemID === null} onClick={() => handleDeleteItem()}>
									<ListItemText primary="Remove Item"/>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleStep(1000)}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)]]]}
								{showCreateItem === 1 && (
								<>
								<ListItem>
									<Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
										<Grid item>
											<Typography variant="h5">
												Add New Item to {selCategoryName}
											</Typography>
										</Grid>
										<Grid item>
											<img src={itemMediaTempURL} className={classes.adminMenuManagerItemImage} hidden={!itemMediaTempURL}/>
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
												id="item-name" 
												label="Item Name"
												onChange={(e) => {setItemName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={itemName} 
											/>
										</Grid>
										<Grid item>
											<TextField 
												id="item-desc" 
												label="Item Description"
												onChange={(e) => {setItemDesc(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={itemDesc}
												multiline={true}
												rows={6}
											/>
										</Grid>
										<Grid item>
											<NumericInput
										      value={itemPrice}
										      name='item-price'
										      precision='2'
										      decimalSeparator='.'
										      thousandSeparator=' '
										      label='Item Price'
										      onChange={(value) => {setItemPrice(value)}}
										      variant='filled'
										    />
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleAddNewItem()} disabled={itemName === '' || itemMediaTempURL === null}>
												Submit
											</Button>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleCancelNewItem()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)}
								{showEditItem === 1 && (
								<>
								<ListItem>
									<Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminMenuManagerEditContainer}>
										<Grid item>
											<div className={classes.adminMenuManagerContainerDiv}>
												<Typography noWrap variant="h5">
													Edit {selItemName}
												</Typography>
											</div>
										</Grid>
										<Grid item>
											<img src={selItemMedia} className={classes.adminMenuManagerItemImage} hidden={!selItemMedia}/>
										</Grid>
										<Grid item>
											<img src={itemMediaTempURL} className={classes.adminMenuManagerItemImage} hidden={!itemMediaTempURL}/>
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
											      	Change Image
											      </Button>
											    </label>
										</Grid>
										<Divider />
										<Grid item>
											<TextField 
												id="item-name" 
												label="Item Name"
												onChange={(e) => {setSelItemName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={selItemName} 
											/>
										</Grid>
										<Grid item>
											<TextField 
												id="item-desc" 
												label="Item Description"
												onChange={(e) => {setSelItemDesc(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={selItemDesc}
												multiline={true}
												rows={6}
											/>
										</Grid>
										<Grid item>
											<NumericInput
										      value={selItemPrice}
										      name='item-price'
										      precision='2'
										      decimalSeparator='.'
										      thousandSeparator=' '
										      label='Item Price'
										      onChange={(value) => {setSelItemPrice(value)}} 
										      variant='filled'
										    />
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleEditItem()} disabled={selItemName === ''}>
												Save
											</Button>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleCancelEditItem()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)}
								{showMoveItem === 1 && (
								<>
								<ListItem>
									<Typography variant="h6">
										Move {selItemName}
									</Typography>
								</ListItem>
								<ListItem button onClick={() => handleMoveItem(1)} disabled={selItemMap === 0}>
									<ListItemText primary="Move Item Up" />
								</ListItem>
								<ListItem button onClick={() => handleMoveItem(0)} disabled={selItemMap === itemList.length-1}>
									<ListItemText primary="Move Item Down" />
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleCancelMoveItem()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
								)}
								{showChangeItemCategory === 1 && (
								<>
								<ListItem>
									<Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
										<Grid item>
											<Typography variant="h5">
												Change {selItemName} Category
											</Typography>
										</Grid>
										<Grid item>
											<FormControl>
												<InputLabel>Category</InputLabel>
													<Select value={selNewCategoryID}>
													{categoryList.map((category, index) => (
														<MenuItem key={index} value={category.category_id} onClick={() => handleSelNewCategory(category.category_id, category.category_name)}>{category.category_name}</MenuItem>
													))}
													</Select>
											</FormControl>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" onClick={() => handleChangeItemCategory()}>
												Submit
											</Button>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleCancelChangeItemCategory()}>
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

export default AdminItemManager;