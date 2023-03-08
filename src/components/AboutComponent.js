import * as React from 'react';

import {
	Box, Typography, Button
} from '@mui/material';

export default function AboutComponent() {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				position: 'absolute',
				top: 10,
				bottom: 70,
				left: 30,
				right: 30
			}}
		>
			<Typography sx={{ fontSize: 20 }}>
				Mario's
			</Typography>
			<Box
				component="img"
				sx={{
					height: 200,
					width: 200
				}}
				alt="TCode Helper Logo."
				src='images/logo.png'
			/>

			<Typography sx={{ fontSize: 20 }}>
				...per quando i Transaction Codes iniziano a essere troppi...
			</Typography>

			<Button
				variant="outlined"
				sx={{ mt: 5 }}
				onClick={() => {
					chrome.tabs.create({
						url: "https://github.com/PicciMario/TCodeHelperChrome"
					});
				}}>
				GitHub Repository
			</Button>
		</Box>

	)
}