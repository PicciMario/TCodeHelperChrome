import * as React from 'react';

import {
	Box, Typography, Button, Grid, Paper, Link
} from '@mui/material';
import { styled } from '@mui/material/styles';

export default function AboutComponent() {

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));


	return (

		<>
			<Box sx={{ flexGrow: 1, m: 1, mt: 3, ml:3, mr:3 }}>

				<Grid container spacing={2} >

					<Grid item xs={4}>
						<Paper elevation={0} >
							<Box
								component="img"
								sx={{
									width: '100%'
								}}
								alt="TCode Helper Logo."
								src='images/logo.png'
							/>
						</Paper>
					</Grid>

					<Grid item xs={8}>
						<Paper elevation={0} style={{ width: "100%" }}>

							<Typography sx={{ fontSize: 16, textAlign: 'left', mb: 1, fontWeight: "bold" }}>
								TCode Helper (Chrome version)
							</Typography>
							<Typography sx={{ fontSize: 14, textAlign: 'left' }}>
								Per quando i Transaction Codes iniziano a essere troppi.
							</Typography>

						</Paper>
					</Grid>

				</Grid>


				<Typography sx={{ textAlign: "left", mb: 1, mt:3 }}>
					Questa è la mia piccola collezione di TCodes, costruita un pò a memoria e un pò raccogliendo appunti e foglietti sparsi per la scrivania.
					E' un work in progress, quindi ne verranno aggiunti altri man mano che mi capitano tra le mani.
				</Typography>

				<Typography sx={{ textAlign: "left", mb: 1 }}>
					I TCodes sono letti direttamente dal file 
					<Link
						sx={{ ml: 0.5, mr: 0.5 }}
						onClick={() => {
							chrome.tabs.create({
								url: "https://github.com/PicciMario/TCodeHelper/blob/master/tcodes.json"
							});
						}}
					>
						TCodes.json
					</Link>
					nel
					<Link
						sx={{ ml: 0.5, mr: 0.5 }}
						onClick={() => {
							chrome.tabs.create({
								url: "https://github.com/PicciMario/TCodeHelper/"
							});
						}}
					>
						repository GitHub
					</Link>
					, e vengono aggiornati alla pressione del pulsante
					"Download TCodes" in alto a destra nella UI principale.
				</Typography>

				<Typography sx={{ textAlign: "left", mb: 1 }}>
					Se avete suggerimenti, correzione o aggiunte, email e pull request sono sempre bene accetti :-)
				</Typography>

				<Typography sx={{ textAlign: "left", mb: 1 }}>
					Grazie!
				</Typography>

				<Typography sx={{ textAlign: "right", mr: 5, fontStyle: "italic", fontWeight: "bold" }}>
					<Link
						onClick={() => {
							chrome.tabs.create({
								url: "https://www.mariopiccinelli.it"
							});
						}}
					>
						Il Mario
					</Link>
				</Typography>

			</Box>

		</>

	)
}