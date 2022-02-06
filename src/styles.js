

const styles = theme => ({


	container : {
		height: '100%',
		maxHeight : '100%',
		margin : theme.spacing(2)
	},
	icon : {
		marginRight: theme.spacing(2),
	},
	buttons : {
		
	},
	PrimaryText : {
		color: '#000000DE'
	}, 
	imgButton : {
		width: '100%',
		height: '100%'
	},
	img : {
	    display: 'block',
	    maxWidth: '155%',
	    maxHeight: '155%',
	},
	fab: {
		position: 'fixed',
    	bottom: theme.spacing(6),
    	left: '50%',
    	transform: 'translateX(-50%)',
    	
	},

	//Welcome styles

	categoryBar : {
		textAlign: 'center'
	},

	//Menu styles

	mainContainer : {
		maxHeight: '85vh',
		overflow: 'hidden'
	},
	menuAccordionContainer : {
		marginTop: theme.spacing(3),
		overflow: 'scroll',
		maxHeight: '76vh',
		paddingBottom: '15vh'
	},
	menuItemContainer : {

	},
	menuAccordion : {
		maxHeight: '100%'
	},
	menuItem : {
		paddingBottom: theme.spacing(4),
	},
	menuItemMedia : {
		maxHeight: '128px',
		maxWidth: '128px',
		marginTop: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	menuItemText : {
		paddingLeft: theme.spacing(1),
	},
	menuItemTextTitleDiv : {
		maxWidth: '100%',
		maxHeight: '100%',
		overflow: 'hidden'
	},
	menuItemTextTitle : {
		fontSize: '18px',
	},
	menuItemTextDescDiv : {
		maxWidth: '100%',
		overflowWrap: 'break-word',
	},
	menuItemTextDesc : {
		fontSize: '14px',
		color: '#0000008A',
		textAlign: 'left',
	},

	//Menu item selection dialog
	dialogBox : {
		paddingTop: '0',
		paddingRight: '0',
		paddingLeft: '0',
	},
	dialogMedia : {
		width: '100%',
		height: '35vh',
		objectFit: 'cover',
	},
	dialogContent : {

	},
	dialogTitle : {
		paddingTop: '4px !important',
		paddingLeft: '0 !important',
		paddingBottom: '8px !important',
		color: '#000000DE',
	},
	dialogSubtitle : {
		paddingTop: '0',
		paddingBottom: theme.spacing(1),
		color: '#000000DE'
	},
	dialogText : {
		fontSize: '14px !important',
		paddingRight: '0',
		paddingLeft: '0',
	},
	dialogButton : {
		marginRight: theme.spacing(2),
	},

	//menu cart drawer styles
	cartDrawer: {

        maxHeight: '75%',
        maxWidth: '600px',
        margin: 'auto',
       
     },
     cartDrawerItemName: {
        
     },

	cartSubtotalText : {
		fontWeight: 'bold !important',
	},

	//QR code page styles
	processOrderContainer : {
		paddingTop: theme.spacing(4),
	},
	orderQrImg : {
		height: 'auto',
		width: '100%',
	},
	orderQrContainer : {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	},
	orderQrButtonTopDiv : {
		width:'100%',
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(0),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	orderQrButtonBotDiv : {
		width:'100%',
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	orderQrButtonTop : {
		width:'90%',
	},
	orderQrButtonBot : {
		width:'90%',
	},
	//view order styles
	viewOrderContainer: {
		marginTop: theme.spacing(2),
	},
	//Login card style
	loginCardGrid : {
		marginTop: theme.spacing(10)
	},
	loginCard : {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		paddingBottom: theme.spacing(2)
	},
	loginCardContent : {
		flexGrow: 1,
	},
	loginFormContainer : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},

	//Admin General styles
	adminNavigationContainer : {
		paddingTop: theme.spacing(8),
		height: '100vh',
		overflow: 'scroll'
	},
	adminCategoryDivider : {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2)
	},



	//Admin category manager styles
	adminCategoryManagerCreateCategoryContainer : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},
	adminCategoryManagerCardGridContainer : {
		overflow: 'auto',
		maxHeight: '95vh',
	},
	adminCategoryManagerCardGrid : {
		marginTop: theme.spacing(10),
		marginBottom: theme.spacing(4),
	},
	adminCategoryManagerCard : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(12),
		paddingRight: theme.spacing(12),
	},
	adminCategoryManagerCategoryImage : {
		height: '200px',
		width: '300px'
	},
	adminCategoryManagerSelectedMain : {
		marginTop: theme.spacing(2),
	},
	adminCategoryManagerSelect : {
		minWidth: '250px',
		maxWidth: '250px',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},


	//Admin Menu Manager Styles
	adminMenuListContainer : {
		paddingTop: theme.spacing(6),
		maxHeight: '95vh',
		overflow: 'auto',
	},

	adminMenuManagerCategoryCardGrid : {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
		borderRight: 'solid 1px #dcdcdc',
	},
	adminMenuManagerCategoryCard : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},

	adminMenuManagerItemCardGrid : {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4)
	},
	adminMenuManagerItemMedia : {
		height: '48px',
		width: '48px'
	},
	adminMenuManagerItemCard : {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
	adminMenuManagerItemImage : {
		height: '128px',
		width: '128px'
	},
	adminMenuManagerEditContainer : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		overflow: 'scroll'
	},
	adminMenuManagerContainerDiv : {
		maxWidth: '20vw',
	},
	adminMenuManagerEditContainerDiv : {
		maxHeight: '95vh',
		overflow: 'scroll'
	},

});

export default styles;
