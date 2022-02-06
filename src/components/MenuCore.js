import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";


import Welcome from './Welcome';
import Preview from './Preview';
import DoMenu from './DoMenu';
import ProcessOrder from './ProcessOrder';
import ViewOrder from './ViewOrder';


import Login from './admin/Login';
import Admin from './admin/Admin';
import AdminCategoryManager from './admin/AdminCategoryManager';
import AdminItemManager from './admin/AdminItemManager';
import AdminMainCategoryManager from './admin/AdminMainCategoryManager';


import useClasses from '../classes'
import styles from '../styles';


function MenuCore() {

	const classes = useClasses(styles);


	//Selected main category for menu browsing
	const [selectedMainCategoryID, setSelectedMainCategoryID] = React.useState(null);

	const [step, setStep] = React.useState(1);
	//auth token for admin login
	const [token, setToken] = React.useState(null);
	//Cart contents
	let [cart, setCart] = React.useState([]);
	//Cart id to link to
	let [cartToken, setCartToken] = React.useState(null);

	function GetOrderParams() {
		const params = useParams();
		setCartToken(params.token);
		setStep(4);
		return(<></>);
	}

	switch(step) {
			case 1:
				return (
					<div>
						<Router>
							<Switch>
								<Route exact path="/" render={() => 
									<Welcome
											selectedMainCategoryID={selectedMainCategoryID}
											setSelectedMainCategoryID={id => setSelectedMainCategoryID(id)}  
											handleStep={step => setStep(step)} 
											cart={cart}
											setCart={cart => setCart(cart)}
											cartToken={cartToken}
											setCartToken={cartToken => setCartToken(cartToken)}
										/>} />
								<Route exact path="/preview" render={() => 
										<Preview 
											handleStep={step => setStep(step)}
											selectedMainCategoryID={selectedMainCategoryID}
											setSelectedMainCategoryID={id => setSelectedMainCategoryID(id)}  
										/>} />
								<Route exact path="/admin" render={() => setStep(1000)} />
								<Route path="/order/:token/" render={() => <GetOrderParams />} exact />
							</Switch>
						</Router>

						
					</div>
					)
			case 2:
				return (
					<div>
						<DoMenu
							selectedMainCategoryID={selectedMainCategoryID}
							setSelectedMainCategoryID={id => setSelectedMainCategoryID(id)} 
							step={step} 
							handleStep={step => setStep(step)}
							cart={cart}
							setCart={cart => setCart(cart)}
							cartToken={cartToken}
							setCartToken={cartToken => setCartToken(cartToken)}
						/>
					</div>
					)
			case 3:
				return (
					<div>
						<ProcessOrder
							handleStep={step => setStep(step)}
							cart={cart}
							setCart={cart => setCart(cart)}
							cartToken={cartToken}
							setCartToken={cartToken => setCartToken(cartToken)}
						/>
					</div>
					)
			case 4:
				return (
					<div>
						<ViewOrder
							handleStep={step => setStep(step)}
							cartToken={cartToken}
							setCartToken={cartToken => setCartToken(cartToken)}
						/>
					</div>
					)



			case 999:
				return (
					<div>
						<Login 
							step={step} 
							handleStep={step => setStep(step)}
							token={token}
							setToken={token => setToken(token)}
						/>
					</div>
					)

			case 1000:
				return (
					<div>
						<Admin 
							handleStep={step => setStep(step)} 
							token={token}
							setToken={token => setToken(token)}
						/>
					</div>
					)
			case 1001:
				return (
					<div>
						<AdminCategoryManager 
							handleStep={step => setStep(step)} 
						/>
					</div>
					)
			case 1002:
				return (
					<div>
						<AdminItemManager 
							handleStep={step => setStep(step)} 
						/>
					</div>
					)
			case 1003:
				return (
					<div>
						<AdminMainCategoryManager 
							handleStep={step => setStep(step)} 
						/>
					</div>
					)
		}

}


export default MenuCore;