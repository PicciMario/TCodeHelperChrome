import * as React from 'react';

import {
	Typography,
	TextField,
	Box,
	FormControl,
	Paper,
	IconButton,
	CircularProgress,
	Snackbar,
	Button,
	Alert,
	Tooltip,
	Card,
	CardContent,
	CardActions
} from '@mui/material';

export default function AboutComponent() {
	return (
		<Box
		sx={{
		  width: 300,
		  height: 300,
		  marginLeft: 'auto',
		  marginRight: 'auto',
		  backgroundColor: 'primary.dark',
		  '&:hover': {
			backgroundColor: 'primary.main',
			opacity: [0.9, 0.8, 0.7],
		  },
		}}
	  />
	)
}