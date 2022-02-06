import React from 'react';
import MenuCore from './components/MenuCore';

import { createTheme, responsiveFontSizes, StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider, StylesProvider } from '@mui/styles';
import { ThemeProvider } from '@emotion/react';

import useStyles from './styles';

//Auto responsive font sizes by viewport
let theme = createTheme();
theme = responsiveFontSizes(theme);


const App = () => {


	return (
		<StylesProvider injectFirst>
    		<MuiThemeProvider theme={theme}>
				<ThemeProvider theme={theme}>
					<MenuCore />
				</ThemeProvider>
			</MuiThemeProvider>
 		 </StylesProvider>
		)
}

export default App;